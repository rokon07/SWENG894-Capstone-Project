const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { email, password: Npassword, fname, lname, phone, dob, role, gender, race } = req.body;
    if (!email || !Npassword) {
        return res.json({ status: "error", error: "Please enter your email and password." });
    }

    // Validate phone number (should be exactly 10 digits)
    if (!/^\d{10}$/.test(phone)) {
        return res.json({ status: "error", error: "Phone number must be exactly 10 digits." });
    }

    // Set default values for gender and race if role is admin
    const finalGender = role === 'admin' ? 'unspecified' : gender;
    const finalRace = role === 'admin' ? 'unspecified' : race;

    db.query('SELECT email FROM user_data WHERE email = ?', [email], async (err, result) => {
        if (err) {
            throw err;
        }
        if (result[0]) {
            return res.json({ status: "error", error: "Email has already been registered!" });
        } else {
            const password = await bcrypt.hash(Npassword, 8);

            db.query('INSERT INTO user_data SET ?', {
                email: email,
                password: password,
                fname: fname,
                lname: lname,
                phone: phone,
                dob: dob,
                role: role,
                gender: finalGender,
                race: finalRace
            }, (error, results) => {
                if (error) {
                    throw error;
                }
                return res.json({ status: "success", success: "User has been registered; you can try logging in!" });
            });
        }
    });
};

module.exports = register;
