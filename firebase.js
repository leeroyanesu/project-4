var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const admin  =  require("firebase-admin")
admin.initializeApp();
const collection = admin.firestore().collection('project-4');
function getDocumentsParallel() {
    return __awaiter(this, void 0, void 0, function* () {
        const docPromises = [];
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
        const batchedSnapshots = yield Promise.all(docPromises);
        const documents = [];
        for (const snapshot of batchedSnapshots) {
            snapshot.forEach((document) => {
                documents.push(document.data());
            });
        }
        return documents;
    });
}
// Usage
getDocumentsParallel()
    .then((documents) => {
    console.log(documents);
})
    .catch((error) => {
    console.error('Failed to fetch documents: ', error);
});
