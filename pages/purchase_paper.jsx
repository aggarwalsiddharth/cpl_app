import { useState } from "react";
import Link from "next/link";
import clientPromise from "../lib/mongodb";
import Nav from "../components/Nav";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function PurchasePaper({ paper_list }) {
  const today = new Date();

  // Get the individual components of the date (year, month, day)
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Months are zero-based, so add 1
  const day = today.getDate();

  // Format the date as a string (YYYY-MM-DD)
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  const [formData, setFormData] = useState({
    date: formattedDate,
    bill: "",
    paper: "",
    quantity: "",
    waste: "",
    sheets: "",
    remark: "PURCHASE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    // Submit form data to serverless function
    const response = await fetch("/api/submitPaperInventory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Data saved successfully");
      // Optionally, you can navigate to a success page or display a success message
    } else {
      alert("Data save failed");
    }
    setFormData({
      date: formattedDate,
      bill: "",
      paper: "",
      quantity: "",
      waste: "",
      sheets: "",
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Nav />
      <h1>Add Purchase of Paper Roll</h1>
      <h3> Enter Sale Date:</h3>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <h3> Enter Bill No:</h3>
      <input
        type="text"
        name="bill"
        value={formData.bill}
        onChange={handleChange}
        placeholder="Bill No"
        required
      />
      <h3> Select Paper:</h3>
      <select
        name="paper"
        value={formData.paper}
        onChange={handleChange}
        required
      >
        <option value="" disabled defaultValue hidden>
          Paper
        </option>
        {paper_list.map((paper) => (
          <option key={paper._id} value={paper.Paper}>
            {paper.Paper}
          </option>
        ))}
      </select>
      <Link href={"/add_paper"}>Paper not in list?</Link>

      <h3> Enter Purchase Quantity(in KG):</h3>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <br />
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("cpl_stock");

    const paper_list = await db.collection("paper_list").find({}).toArray();

    return {
      props: {
        paper_list: JSON.parse(JSON.stringify(paper_list)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
