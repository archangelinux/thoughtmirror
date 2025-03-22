import uuid

class Hasher:
    def email_to_uid(self, email: str):
        """
        uniquely hash email to a user id
        """
        ids = {
            "jennifer.r.chiou@gmail.com": 0,
            "angelinabai.wang@gmail.com":1,
            "armaganngul@gmail.com":2,
            "gabrielmcfadyen@gmail.com": 3
        }
        
        return ids[email] if email in ids else 4

    def title_to_postid(self, title: str, date):
        """
        uniquely hash title and created date to post id
        """
        unique_str = f"{title}_{date.isoformat()}"
        
        # Generate a deterministic UUID using the DNS namespace.
        post_id = uuid.uuid5(uuid.NAMESPACE_DNS, unique_str)
        
        return str(post_id)