import * as admin from 'firebase-admin';

admin.initializeApp();
const collection = admin.firestore().collection('project-4');

async function getDocumentsParallel(): Promise<any[]> {
  const docPromises: Promise<any>[] = [];
  const numDoc = 100000;  
  const numBatches = Math.ceil(numDoc / 10000);

  for (let i = 0; i < numBatches; i++) {
    const batchStart = i * 10000;
    const batchEnd = Math.min(batchStart + 10000, numDoc);

    // Create a promise for each batch of documents
    const documentPromise = collection.orderBy("score")
                                     .startAt(batchStart)
                                     .endAt(batchEnd)
                                     .get();

    // Push the promise to the array
    docPromises.push(documentPromise);
  }
  
  const batchedSnapshots = await Promise.all(docPromises);

  const documents: any[] = [];
  for (const snapshot of batchedSnapshots) {
    snapshot.forEach((document) => {
      documents.push(document.data());
    });
  }

  return documents;
}

// Usage
getDocumentsParallel()
  .then((documents) => {
    console.log(documents);
  })
  .catch((error) => {
    console.error('Failed to fetch documents: ', error);
  });
