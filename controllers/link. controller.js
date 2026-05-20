import { Link } from "../models/Link.js";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({ uid: req.uid });
    return res.json({ links });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error de servidor" });
  }
};


export const createLink= async (req, res)=>{
 try {
  const {longLink} = req.body

  return res.json({ longLink });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "error de servidor" });
  }

}