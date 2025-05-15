import React, { useState } from "react";

// I create a component called Userform
function UserForm() {
  // I create a seperate state variable for each input using the hook useSate
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // This function runs when the form is submitted
  function handleSubmit(event) {
    // Stops the page from reloading
    event.preventDefault(); 
    console.log("User Info Submitted:", {
      name: name,
      email: email,
      message: message,
    });
    // I clear the input fields
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto" }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              style={{ display: "block", width: "100%", padding: "8px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ display: "block", width: "100%", padding: "8px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label>
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us something..."
              style={{ display: "block", width: "100%", padding: "8px", minHeight: "56px" }}
              required
            />
          </label>
        </div>

        <button type="submit" style={{ padding: "10px 24px" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default UserForm;

// https://legacy.reactjs.org/docs/forms.html
// https://dev.to/ajones_codes/a-better-guide-to-forms-in-react-47f0
