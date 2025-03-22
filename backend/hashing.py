import uuid

class Hasher:
    def email_to_uid(self, email: str):
        """
        uniquely hash email to a user id
        """
        return str(uuid.uuid5(uuid.NAMESPACE_DNS, email))

    def title_to_postid(self, title: str, date):
        """
        uniquely hash title and created date to post id
        """
        unique_str = f"{title}_{date.isoformat()}"
        
        # Generate a deterministic UUID using the DNS namespace.
        post_id = uuid.uuid5(uuid.NAMESPACE_DNS, unique_str)
        
        return str(post_id)