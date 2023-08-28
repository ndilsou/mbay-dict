import { promises as fs } from "fs";
import { MongoClient, ObjectId } from "mongodb";
import R from "remeda";

function createIndexKey(text) {
  const lowerCase = text.toLowerCase();
  const cleanText = lowerCase.replace(/^['\(\{\[-]/, "");
  const firstLetter = cleanText.charAt(0);
  const candidate = firstLetter.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  let indexKey;
  if (candidate.charCodeAt(0) >= 97 && candidate.charCodeAt(0) <= 122) {
    indexKey = candidate;
  } else {
    indexKey = "MISC";
  }
  return indexKey;
}

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
      const french_translation = entry.french_translation;
      const english_translation = entry.english_translation;

      let transformedEntry = R.omit([
        "example_ids",
        "id",
        "french_translation",
        "english_translation",
      ])(entry);
      transformedEntry._id = new ObjectId();
      transformedEntry.french = {
        translation: french_translation,
        key: createIndexKey(french_translation),
      };
      transformedEntry.english = {
        translation: english_translation,
        key: createIndexKey(english_translation),
      };

      // Filter examples belonging to current entry
      transformedEntry.examples = examples.filter(
        (e) => e.entry_id === entry.id
      );

      return transformedEntry;
    });

    // await fs.writeFile("./collections.json", JSON.stringify(entries, null, 2));

    await entriesCollection.insertMany(entries);
    await entriesCollection.createIndexes([
      { key: { "french.translation": 1 }, name: "frenchTranslationIndex" },
      { key: { "french.key": 1 }, name: "frenchKeyIndex" },
      { key: { "english.translation": 1 }, name: "englishTranslationIndex" },
      { key: { "english.key": 1 }, name: "englishKeyIndex" },
    ]);

    console.log("Upload successful.");
    await client.close();
  } catch (err) {
    console.error(err);
  }
};

uploadData();
