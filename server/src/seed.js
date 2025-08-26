import faker from "faker";
import mongoose from "mongoose";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import { MONGO_URI } from "./config.js";

const SOURCES = ["website","facebook_ads","google_ads","referral","events","other"];
const STATUSES = ["new","contacted","qualified","lost","won"];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected");

  const email = "test@demo.com";
  const password = "test1234";

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, password });
  console.log("Seed user:", email, "password:", password);

  const count = await Lead.countDocuments({ owner: user._id });
  if (count < 120) {
    const bulk = [];
    const now = Date.now();
    for (let i = 0; i < 150; i++) {
      const first = faker.name.firstName();
      const last = faker.name.lastName();
      bulk.push({
        first_name: first,
        last_name: last,
        email: faker.internet.email(first, last).toLowerCase() + i,
        phone: faker.phone.phoneNumber(),
        company: faker.company.companyName(),
        city: faker.address.city(),
        state: faker.address.stateAbbr(),
        source: SOURCES[Math.floor(Math.random()*SOURCES.length)],
        status: STATUSES[Math.floor(Math.random()*STATUSES.length)],
        score: Math.floor(Math.random()*101),
        lead_value: Number(faker.commerce.price(100, 10000)),
        last_activity_at: Math.random() > 0.3 ? new Date(now - Math.random()*60*24*3600*1000) : null,
        is_qualified: Math.random() > 0.5,
        owner: user._id
      });
    }
    await Lead.insertMany(bulk);
    console.log("Inserted leads:", bulk.length);
  } else {
    console.log("Leads already present:", count);
  }
  await mongoose.disconnect();
  console.log("Done");
}

run().catch(e => { console.error(e); process.exit(1); });
