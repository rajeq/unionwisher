const formatDate = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

module.exports = [
  {
    name: "Ravi",
    phone: "9440059431",
    email: "rajeshthesoft97@gmail.com",
    dob: formatDate(0),
    anniversary: formatDate(1),
    union: "Union A"
  },
  {
    name: "Suresh",
    phone: "9701415172",
    email: "rajeshthesoft97@gmail.com",
    dob: formatDate(1),
    anniversary: formatDate(0),
    union: "Union B"
  },
  {
    name: "Dhana",
    phone: "9701415172",
    email: "rajeshthesoft97@gmail.com",
    dob: formatDate(0),
    anniversary: formatDate(0),
    union: "Union A"
  }
];