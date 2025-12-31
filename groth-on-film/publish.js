const { createClient } = require('@sanity/client');

console.log("Script started... Connecting to Sanity.");

const client = createClient({
  projectId: 'o0lkpygl',
  dataset: 'production',
  useCdn: false,
  token: 'skc9XAMPmbODW9wPIey9981HYhidQt1bQw2nd6ifxHtdHUv8Bs8mojddPOZBrNsBpe2JQNFURO1216u8LPtbg9RCmKWLLluLGtVpnI8i9dFERoBraIt6LTOUfNukKu2krt3OdtMmKD6ulymtwkDkYNr0s86rmDZd46fkjJqTVC4WruUwqGCG',
  apiVersion: '2025-12-31',
});

async function publishAll() {
  console.log("Fetching drafts...");
  const drafts = await client.fetch(`*[_id in path("drafts.**")]`);
  
  if (drafts.length === 0) {
    console.log("RESULT: No drafts found.");
    return;
  }
  
  console.log(`RESULT: Found ${drafts.length} drafts. Publishing...`);

  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '');
    await client.transaction()
      .createOrReplace({ ...draft, _id: publishedId })
      .delete(draft._id)
      .commit();
    console.log(`DONE: Published ${draft.title || draft._id}`);
  }
  console.log("FINISHED: All documents are live.");
}

publishAll().catch(err => console.error("ERROR:", err.message));
