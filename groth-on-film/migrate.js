const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'o0lkpygl',
  dataset: 'production',
  useCdn: false,
  // Use the same Admin Token you used for the publish script
  token: 'skvT1CDw2k7XuzMcnHljiPji4AgQj3sWb0F8jj6b710axWlqTX8cTdzvVNGnVvK3EKMoHW5I5rasaNHQiuNvRErRDe06Cy7WyOFTMYdJDaLXxomxELHnj3KQuR1K5EPA6q2cUxvYfpcum7LVRfHboLPogddXrHEBFLOcEoRHLxavgVoQLcfo', 
  apiVersion: '2025-12-31',
});

async function migrate() {
  const reviews = await client.fetch(`*[_type == "vaultReview"]`);
  console.log(`Starting migration for ${reviews.length} reviews...`);

  const transaction = client.transaction();

  reviews.forEach(review => {
    // This checks if the old array exists and if the new body is empty
    if (review.paragraphs && Array.isArray(review.paragraphs)) {
      const joinedBody = review.paragraphs.join('\n\n');
      
      transaction.patch(review._id, {
        set: { body: joinedBody }
      });
      console.log(`Prepared: ${review.title}`);
    }
  });

  await transaction.commit();
  console.log("Migration successful. Verify the 'Review Body' in Sanity Studio.");
}

migrate().catch(console.error);