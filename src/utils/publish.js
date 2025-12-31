const { createClient } = require('@sanity/client');

// This will print the moment you hit enter
console.log("Script started... Connecting to Sanity.");

const client = createClient({
  projectId: 'o0lkpygl',
  dataset: 'production',
  useCdn: false,
  token: 'sk68c9OIRaDnoZ8BgGG9ebyaXbo84U2RszvXRqpu18JsphS65z5Le7qslnI1LKJgwrLr5XAivZMgNye9c5uRMsEgHwP23uQlSeu04pbxNdQ97Ss3MbJDAaLdebUF8OlJ3roT09jWXPnaJvFaZReDHSlRSJe78HT64LH1EqsneyiPRzxqGirD',
  apiVersion: '2025-12-31',
});

async function publishAll() {
  console.log("Fetching drafts from database...");
  
  // This query ignores the type and just finds everything starting with 'drafts.'
  const drafts = await client.fetch(`*[_id in path("drafts.**")]`);
  
  if (drafts.length === 0) {
    console.log("RESULT: No drafts found. Your documents might already be published.");
    return;
  }
  
  console.log(`RESULT: Found ${drafts.length} drafts. Starting publishing process...`);

  for (const draft of drafts) {
    const publishedId = draft._id.replace('drafts.', '');
    
    await client.transaction()
      .createOrReplace({ ...draft, _id: publishedId })
      .delete(draft._id)
      .commit();
      
    console.log(`DONE: Published ${draft.title || draft._id}`);
  }
  
  console.log("FINISHED: All documents are now live.");
}

// THIS LINE IS REQUIRED TO ACTUALLY RUN THE CODE
publishAll().catch(err => {
  console.error("ERROR:", err.message);
});