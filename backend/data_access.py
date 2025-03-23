from typing import Optional
from utils.firebase import db
from firebase_admin import firestore


class FirebaseDataAccess:
    """
    Get and upload to database

    desired format:
    users (collection)
        └── UID_12345 (document)
            ├── email: "abc@gmail.com"
            └── journalEntries (subcollection)
                └── postID_67890 (document)
                    ├── title: "My Day"
                    ├── time_created: <timestamp>
                    ├── time_last_edited: <timestamp>
                    └── post_content: "Today I..."
    """
    def __init__(self, collection_name: str, uid: str):
        self.collection_name = collection_name
        self.uid = uid

    def create_user(self, user_email: str, journal_entry: Optional[dict]):
        """
        add a user document into the users collection, with an empty journalEntries
        subcollection for now, unless journal_entry param is given
        """
        user_ref = db.collection(self.collection_name).document(self.uid)

        # Create the user document with the email
        user_ref.set({"email": user_email}, merge=True)
        print(f"User {self.uid} created with email: {user_email}")

        # If a journal entry is provided, add it to the user's journalEntries subcollection.
        if journal_entry is not None:
            self.add_journal_entry(self.uid, journal_entry)

    def add_journal_entry(self, title: str, content: str, post_id: str):
        journal_entries = (
            db.collection(self.collection_name).document(self.uid).collection("journalEntries")
        )

        entry_data = {
            "title": title,
            "post_content": content,
            "time_created": firestore.SERVER_TIMESTAMP,
            "time_last_edited": firestore.SERVER_TIMESTAMP,
            "distortions": {},
        }

        # Add the document to the subcollection, setting the document id from our postID
        doc_ref = journal_entries.document(post_id)
        doc_ref.set(entry_data)

        print(f"Journal entry added for user {self.uid} with document reference: {doc_ref}")
        return doc_ref

    def delete_journal_entry(self, post_id: str):
        """
        delete a journal entry from the database
        """
        journal_entry_ref = (
            db.collection(self.collection_name)
            .document(self.uid)
            .collection("journalEntries")
            .document(post_id)
        )
        journal_entry_ref.delete()

    def get_single_entry(self, post_id: str):
        """
        Retrieve a single journal entry by its post_id.
        """
        journal_entry_ref = (
            db.collection(self.collection_name)
            .document(self.uid)
            .collection("journalEntries")
            .document(post_id)
        )
        doc = journal_entry_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None

    def get_journal_entries(self):
        """
        Retrieve all journal entries for a given user.
        """
        print("hi")
        journal_entries_ref = (
            db.collection(self.collection_name).document(self.uid).collection("journalEntries")
        )
        entries = journal_entries_ref.stream()

        # process entries into a list of dictionaries
        results = []
        for entry in entries:
            data = entry.to_dict()
            # mgiht convert Firestore timestamps to Python datetime if needed
            results.append(
                {
                    "post_id": entry.id,
                    "title": data.get("title"),
                    "post_content": data.get("post_content"),
                    "time_created": data.get("time_created"),
                    "time_last_edited": data.get("time_last_edited"),
                    "distortions": {},
                    "word_count": len(data.get("post_content"))
                }
            )
        return results
    
    def upload_journal_entries(self, user_email):
        # users: {self.uid: [user_email, journalEntries: dict]}
        pass

if __name__ == "__main__":
    fda = FirebaseDataAccess(collection_name="users", uid="ah34r")
    #fda.create_user("ah34r", "abc@gmail.com", {"title": "hi", "content": "bye"})
    #fda.create_user("e45", "ter@gmail.com", None)
    #fda.add_journal_entry("e45", {"title": "bro", "content": "bruhg"})
    #fda.get_journal_entries("e45")
    print(fda.get_single_entry("Ho8mR6WlZT4hhrrqU8Tb"))
