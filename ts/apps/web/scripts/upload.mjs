import { promises as fs } from "fs";
import { MongoClient, ObjectId } from "mongodb";
import R from "remeda";

const uploadData = async () => {
  try {
    const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mbay-dictionary.jyvobd6.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 1000,
    });

    await client.connect();
    const entriesCollection = client.db("dictionary").collection("entries");

    let entries = JSON.parse(await fs.readFile("./data/entries.json"));
    let examples = JSON.parse(await fs.readFile("./data/examples.json"));

    // Add MongoDB _id to examples
    examples = R.pipe(
      examples,
      R.map((example) => ({ ...R.omit(["id"])(example), _id: new ObjectId() }))
    );

    // Map through each entry
    entries = entries.map((entry) => {
      // Remove .example_ids from entry, generate MongoDB _id
      let transformedEntry = R.omit(["example_ids", "id"])(entry);
      transformedEntry._id = new ObjectId();

      // Filter examples belonging to current entry
      transformedEntry.examples = examples.filter(
        (e) => e.entry_id === entry.id
      );

      return transformedEntry;
    });

    await entriesCollection.insertMany(entries);

    console.log("Upload successful.");
    await client.close();
  } catch (err) {
    console.error(err);
  }
};

uploadData();
