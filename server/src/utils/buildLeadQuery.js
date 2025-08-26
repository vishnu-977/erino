// Build MongoDB filters from query params to meet "equals/contains/in/gt/lt/between" etc.
export function buildLeadQuery(q, ownerId) {
  const filter = { owner: ownerId };
  const and = [];

  // String equals/contains
  for (const field of ["email","company","city"]) {
    const eq = q[field];
    const contains = q[`${field}_contains`];
    if (eq) and.push({ [field]: eq });
    if (contains) and.push({ [field]: { $regex: contains, $options: "i" } });
  }

  // Enums equals/in
  for (const field of ["status","source"]) {
    const eq = q[field];
    const inside = q[`${field}_in`];
    if (eq) and.push({ [field]: eq });
    if (inside) and.push({ [field]: { $in: inside.split(",") } });
  }

  // Numbers equals/gt/lt/between
  for (const field of ["score","lead_value"]) {
    if (q[`${field}`] !== undefined) and.push({ [field]: Number(q[field]) });
    if (q[`${field}_gt`] !== undefined) and.push({ [field]: { $gt: Number(q[`${field}_gt`]) } });
    if (q[`${field}_lt`] !== undefined) and.push({ [field]: { $lt: Number(q[`${field}_lt`]) } });
    if (q[`${field}_between`]) {
      const [a,b] = q[`${field}_between`].split(",").map(Number);
      and.push({ [field]: { $gte: a, $lte: b } });
    }
  }

  // Dates on/before/after/between
  for (const field of ["created_at","last_activity_at"]) {
    const on = q[`${field}_on`];
    const before = q[`${field}_before`];
    const after = q[`${field}_after`];
    const between = q[`${field}_between`];

    if (on) {
      const d = new Date(on); const next = new Date(d); next.setDate(d.getDate()+1);
      and.push({ [field]: { $gte: d, $lt: next } });
    }
    if (before) and.push({ [field]: { $lt: new Date(before) } });
    if (after) and.push({ [field]: { $gt: new Date(after) } });
    if (between) {
      const [a,b] = between.split(",");
      and.push({ [field]: { $gte: new Date(a), $lte: new Date(b) } });
    }
  }

  // Boolean equals
  if (q.is_qualified !== undefined) {
    const v = String(q.is_qualified).toLowerCase();
    and.push({ is_qualified: v === "true" || v === "1" });
  }

  if (and.length) filter.$and = and;
  return filter;
}
