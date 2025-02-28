import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [desc, setDesc] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [bills, setBills] = useState([]); // State for storing fetched bills
  const [totalAmount, setTotalAmount] = useState(0);


  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      fetchBills(email);
    }
  }, []);

  function calculateTotal(billsData) {
    const sum = billsData.reduce((acc, bill) => acc + parseInt(bill.name), 0);
    setTotalAmount(sum);
  }

  
  function fetchBills(email) {
    fetch(`http://localhost:3000/api/get-bills?email=${email}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Bills:", data); // Debugging log
        if (data.data) {
          setBills(data.data); // Set fetched bills
          calculateTotal(data.data); // Calculate total amount
        } else {
          setBills([]); // Reset if no data
          setTotalAmount(0); // Reset total
        }
      })
      .catch((error) => console.error("Error fetching bills:", error));
  }
  
  

  function addNewBill(event) {
    event.preventDefault();
    if (!userEmail) {
      alert("User not logged in");
      return;
    }

    const billData = { name, datetime, desc, email: userEmail };

    fetch("http://localhost:3000/api/add-bill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Bill added successfully") {
          alert("Bill added!");
          setName("");
          setDatetime("");
          setDesc("");
          fetchBills(userEmail); // Refresh bills list
        } else {
          alert("Error adding bill");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function handleLogout() {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    window.location.reload();
  }

  return (
    <>
      {/* Top-right container for user info and logout */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span style={{ fontWeight: "bold" }}>{userEmail}</span>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 12px",
            background: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <main>
      <h1 className="big-amount">
  <span>{"\u20B9"}{totalAmount.toLocaleString()}</span>
</h1>


        <form onSubmit={addNewBill}>
          <div>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="Price(-5000 or 5000)"
            />
            <input value={datetime} onChange={(ev) => setDatetime(ev.target.value)} type="date" />
          </div>
          <div>
            <input
              type="text"
              value={desc}
              onChange={(ev) => setDesc(ev.target.value)}
              placeholder="Description(phone samsung)"
            />
          </div>
          <button type="Submit">Submit</button>
        </form>

        <div className="transactions">
          {bills.length > 0 ? (
            bills.map((bill, index) => (
              <div className="transaction" key={index}>
                <div className="left">
                  <div className="desc">{bill.desc}</div>
                </div>
                <div className="right">
                  <div className={`price ${bill.name.startsWith("-") ? "negative" : ""}`}>
                    {"\u20B9"}{bill.name}
                  </div>
                  <div className="date">{bill.datetime.split("T")[0]}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No transactions found</p>
          )}
        </div>
      </main>
    </>
  );
}

export default App;
