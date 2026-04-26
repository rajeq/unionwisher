const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

module.exports = {
  unions: ['Union A', 'Union B'],

  employees: [
    {
      name: "Ravi",
      phone: "9440059431",
      email: "rajeshthesoft97@gmail.com",
      dob: today,
      union: "Union A"
    },
    {
      name: "Suresh",
      phone: "9701415172",
      email: "rajeshthesoft97@gmail.com",
      dob: tomorrow,
      union: "Union B"
    },
        {
      name: "Dhana",
      phone: "9440059431",
      email: "rajeshthesoft97@gmail.com",
      dob: today,
      union: "Union A"
    },
            {
      name: "Dhana",
      phone: "9701415172",
      email: "rajeshthesoft97@gmail.com",
      dob: today,
      union: "Union A"
    },
    {
      name: "Dhana",
      phone: "9701415172",
      email: "rajeshthesoft97@gmail.com",
      dob: tomorrow,
      union: "Union B"
    }
  ]
};