const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { email, password: Npassword, fname, lname, phone, dob, role, gender, race } = req.body;

    // Validate inputs
    if (!email || !Npassword) {
        return res.json({ status: "error", error: "Please enter your email and password." });
    }

    if (!/^\d{10}$/.test(phone)) {
        return res.json({ status: "error", error: "Phone number must be exactly 10 digits." });
    }

    // Set default values for gender and race if role is admin
    const finalGender = role === 'admin' ? 'unspecified' : gender;
    const finalRace = role === 'admin' ? 'unspecified' : race;

    try {
        // Check if email already exists
        const [existingUser] = await db.query('SELECT email FROM user_data WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.json({ status: "error", error: "Email has already been registered!" });
        }

        // Hash the password
        const password = await bcrypt.hash(Npassword, 8);

        // Insert the new user into the database
        await db.query('INSERT INTO user_data SET ?', {
            email: email,
            password: password,
            fname: fname,
            lname: lname,
            phone: phone,
            dob: dob,
            role: role,
            gender: finalGender,
            race: finalRace
        });

        return res.json({ status: "success", success: "User has been registered; you can try logging in!", redirectUrl: "/login" });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ status: "error", error: "Internal server error" });
    }
};

module.exports = register;
