// IMPROVED - Exercise 1: Code Readability (Java)
// Changes: standard Java naming, clearer intent, SQL injection fix noted

import java.util.ArrayList;
import java.util.List;

class UserManager {
    private List<User> users;
    private DBConn db;

    public UserManager(DBConn db) {
        this.db = db;
        this.users = new ArrayList<>();
    }

    /**
     * Registers a new user if validation passes and username is unique.
     * @return true if user was added, false if validation failed or username exists
     */
    public boolean addUser(String username, String password, String email) {
        if (!isValidRegistration(username, password, email)) {
            return false;
        }
        if (findUserByUsername(username) != null) {
            return false;
        }

        User newUser = new User(username, password, email);
        users.add(newUser);
        // TODO: Use prepared statement to avoid SQL injection
        boolean saved = db.execute(
            "INSERT INTO users VALUES ('" + username + "', '" + password + "', '" + email + "')"
        );
        return saved;
    }

    private boolean isValidRegistration(String username, String password, String email) {
        return username != null && username.length() >= 3
            && password != null && password.length() >= 8
            && email != null && email.contains("@");
    }

    public User findUserByUsername(String username) {
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                return user;
            }
        }
        return null;
    }
}

class User {
    private final String username;
    private final String password;
    private final String email;

    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }

    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getEmail() { return email; }
}
