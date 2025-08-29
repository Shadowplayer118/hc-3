import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ✅ Get all staff
app.get("/staff", async (req, res) => {
  const { data, error } = await supabase.from("staff").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Add new staff
app.post("/staff", async (req, res) => {
  const { first_name, last_name } = req.body;
  const { data, error } = await supabase
    .from("staff")
    .insert([{ first_name, last_name }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Update staff
app.put("/staff/:staff_id", async (req, res) => {
  const { staff_id } = req.params;
  const { first_name, last_name } = req.body;
  const { data, error } = await supabase
    .from("staff")
    .update({ first_name, last_name })
    .eq("staff_id", staff_id)
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Delete staff
app.delete("/staff/:staff_id", async (req, res) => {
  const { staff_id } = req.params;
  const { data, error } = await supabase.from("staff").delete().eq("staff_id", staff_id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
