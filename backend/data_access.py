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

    def create_users_collection(self, collection_name: str = "all_users"):
        """
        upload data to the database. specialized for Firestore.
        """
        # create empty users collection in firestore
        pass

    def create_user(self, uid: str, user_email: str, journal_entry: Optional[dict]):
        """
        add a user document into the users collection, with an empty journalEntries
        subcollection for now, unless journal_entry param is given

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
        user_ref = db.collection("users").document(uid)

        # Create the user document with the email
        user_ref.set({"email": user_email}, merge=True)
        print(f"User {uid} created with email: {user_email}")

        # If a journal entry is provided, add it to the user's journalEntries subcollection.
        if journal_entry is not None:
            self.add_journal_entry(uid, journal_entry)

    def add_journal_entry(self, uid: str, journal_entry: Optional[dict]):
        journal_entries = (
            db.collection("users").document(uid).collection("journalEntries")
        )

        entry_data = {
            "title": journal_entry["title"],
            "post_content": journal_entry["content"],
            "time_created": firestore.SERVER_TIMESTAMP,
            "time_last_edited": firestore.SERVER_TIMESTAMP,
        }

        # Add the document to the subcollection (auto-generates a document id)
        doc_ref = journal_entries.add(entry_data)

        print(f"Journal entry added for user {uid} with document reference: {doc_ref}")
        return doc_ref

    def delete_journal_entry(self, uid: str, post_id: str):
        """
        delete a journal entry from the database
        """
        journal_entry_ref = (
            db.collection("users")
            .document(uid)
            .collection("journalEntries")
            .document(post_id)
        )
        journal_entry_ref.delete()

    def get_journal_entries(self, uid: str):
        """
        Retrieve all journal entries for a given user.
        """
        journal_entries_ref = (
            db.collection("users").document(uid).collection("journalEntries")
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
                }
            )
        return results


if __name__ == "__main__":
    fda = FirebaseDataAccess()
    fda.create_users_collection("all_users")
    fda.create_user("ah34r", "abc@gmail.com", {"title": "hi", "content": "bye"})
    fda.create_user("e45", "ter@gmail.com", None)
    fda.add_journal_entry("e45", {"title": "bro", "content": "bruhg"})
    fda.get_journal_entries("e45")
