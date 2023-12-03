import { useState } from "react";
import Link from "next/link";
import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function ProductionPaper({ paper_list }) {
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
    remark: "PRODUCTION",
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
      <h1>Add Paper Production:</h1>
      <h3> Enter Production Date:</h3>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <h3> Enter Party Name:</h3>
      <input
        type="text"
        name="bill"
        value={formData.bill}
        onChange={handleChange}
        placeholder="Party Name"
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

      <h3> Enter Production Quantity(in KG):</h3>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        placeholder="Quantity"
        required
      />
      <h3> Enter Wastage Quantity(in KG):</h3>
      <input
        type="number"
        name="waste"
        value={formData.waste}
        onChange={handleChange}
        placeholder="Wastage"
        required
      />
      <h3> Enter Number of Sheets Produced(in pcs):</h3>
      <input
        type="number"
        name="sheets"
        value={formData.sheets}
        onChange={handleChange}
        placeholder="Sheets (in pcs)"
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
