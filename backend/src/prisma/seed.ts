import prisma from "../utils/prisma";

async function main() {
  // await prisma.story.deleteMany();

  const story1 = await prisma.story.create({
    data: {
      title: "The Moon that Can't be Seen",
      author: "Rara",
      synopsis: "A tale about hidden moonlight and the secrets it keeps.",
      category: "Teen Fiction",
      tags: JSON.stringify(["school", "fiction"]),
      status: "Draft",
    },
  });

  const story2 = await prisma.story.create({
    data: {
      title: "Given",
      author: "Sansa S.",
      synopsis: "A romance story about music and love.",
      category: "Romance",
      tags: JSON.stringify(["music"]),
      status: "Draft",
    },
  });

  const story3 = await prisma.story.create({
    data: {
      title: "Fish Swimming In The Sky",
      author: "Kaenarita Faly",
      synopsis: "A fantasy adventure set in a world without gravity.",
      category: "Fantasy",
      tags: JSON.stringify(["fantasy", "romance"]),
      status: "Publish",
    },
  });

  const story4 = await prisma.story.create({
    data: {
      title: "The Science of Fertility PCOS",
      author: "Jessie Inchauspe",
      synopsis: "Understanding PCOS and fertility through science.",
      category: "Non Fiction",
      tags: JSON.stringify(["science", "PCOS"]),
      status: "Publish",
    },
  });

  const story5 = await prisma.story.create({
    data: {
      title: "The Glucose Goddess Method",
      author: "Jessie Inchauspe",
      synopsis: "Manage blood sugar levels to improve your health.",
      category: "Non Fiction",
      tags: JSON.stringify(["glucose", "science"]),
      status: "Publish",
    },
  });

  await prisma.chapter.create({
    data: {
      title: "Chapter 1: The Beginning",
      content: "<p>The moon was hidden behind thick clouds that night...</p>",
      storyId: story1.id,
    },
  });

  await prisma.chapter.create({
    data: {
      title: "Chapter 1: First Note",
      content: "<p>Music has always been my escape from reality...</p>",
      storyId: story2.id,
    },
  });

  await prisma.chapter.create({
    data: {
      title: "Chapter 1: Gravity's End",
      content: "<p>The day the sky turned into an ocean...</p>",
      storyId: story3.id,
    },
  });

  console.log(`Seeded: ${[story1, story2, story3, story4, story5].map(s => s.title).join(", ")}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
