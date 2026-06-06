/** Staff directory — sourced from school records (contactus.html). */

export const MAP_DIRECTIONS_URL = "https://maps.app.goo.gl/7cFKhdnGFT1yrewo6";

export const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.846549298492!2d85.2778692!3d27.6907409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1870f57f16ad%3A0x2dd4a5e8849f77e5!2sJanapath%20Secondary%20School!5e0!3m2!1sen!2snp!4v1712479500000!5m2!1sen!2snp";

export function whatsappUrl(phone) {
  const digits = String(phone).replace(/\D/g, "");
  const normalized = digits.startsWith("977") ? digits : `977${digits}`;
  return `https://wa.me/${normalized}`;
}

export const teachers = [
  { name: "Hira Devi Shrestha", designation: "Principal", phone: "9841252262", group: "Leadership" },
  { name: "Kiran Shali Ghimire", designation: "Asst. Principal", phone: "9851212707", group: "Leadership" },
  { name: "Gopal Basnet", designation: "Asst. Principal", phone: "9841351991", group: "Leadership" },
  { name: "Kiran Chandra K.C.", designation: "Coordinator", phone: "9841822660", group: "General Staff" },
  { name: "Prem Singh Saud", designation: "Coordinator", phone: "9848851512", group: "General Staff" },
  { name: "Jayanti Regmi", designation: "Teacher", phone: "9841554936", group: "General Staff" },
  { name: "Ganga Ghimire", designation: "Class Teacher (9A)", phone: "9860294501", group: "General Staff" },
  { name: "Sabita Regmi", designation: "Teacher", phone: "9851057261", group: "General Staff" },
  { name: "Dinesh Kumar Neupane", designation: "Class Teacher (7B)", phone: "9841290300", group: "General Staff" },
  { name: "Aaiti Ghale", designation: "Class Teacher (6A)", phone: "9841819592", group: "General Staff" },
  { name: "Nirmala Ghimire", designation: "Teacher (10A)", phone: "9841351327", group: "General Staff" },
  { name: "Surendra Devkota", designation: "Teacher (10B)", phone: "9841733931", group: "General Staff" },
  { name: "Indira Dawadi", designation: "Teacher (8A)", phone: "9841160416", group: "General Staff" },
  { name: "Lalita Bhattarai", designation: "Teacher (8B)", phone: "9861165750", group: "General Staff" },
  { name: "Rajan Sedhai", designation: "Teacher (7A)", phone: "9841760046", group: "General Staff" },
  { name: "Sachita Pandey", designation: "Teacher", phone: "9843247048", group: "General Staff" },
  { name: "Kiran Adhikari", designation: "Teacher (4A)", phone: "9841944763", group: "General Staff" },
  { name: "Ravila Regmi Khanal", designation: "Teacher (2)", phone: "9841396609", group: "General Staff" },
  { name: "Nirmala Devi Adhikari", designation: "Teacher", phone: "9843183550", group: "General Staff" },
  { name: "Thanisara Rana", designation: "Teacher", phone: "9841609865", group: "General Staff" },
  { name: "Rita Aryal (Paudel)", designation: "Teacher (3)", phone: "9841728446", group: "General Staff" },
  { name: "Dr. Tika Dhakal", designation: "Discipline Comm.", phone: "9851117174", group: "General Staff" },
  { name: "Yubaraj Ghimire", designation: "Coordinator (5A)", phone: "9841330033", group: "General Staff" },
  { name: "Pushpa Kumari Paudel", designation: "Teacher", phone: "9841524793", group: "General Staff" },
  { name: "Rashmi Napit", designation: "Instructor (6B)", phone: "9849337933", group: "General Staff" },
  { name: "Ratna Kumari Maharjan", designation: "Instructor (4B)", phone: "9841553631", group: "General Staff" },
  { name: "Bina Maharjan", designation: "Instructor", phone: "9841505399", group: "General Staff" },
  { name: "Sita Khanal", designation: "CD Coordinator", phone: "9851151317", group: "General Staff" },
  { name: "Sudha K.C.", designation: "Accountant", phone: "9849885406", group: "General Staff" },
  { name: "Sushila Subedi", designation: "Office Asst.", phone: "9841124621", group: "General Staff" },
  { name: "Eliza Ranamagar", designation: "UKG Teacher", phone: "9866477847", group: "General Staff" },
  { name: "Laxmi Bhattarai", designation: "Nursery Teacher", phone: "9841767817", group: "General Staff" },
  { name: "Ramita Rayamajhi", designation: "Account Asst.", phone: "9849023287", group: "General Staff" },
  { name: "Sangita Adhikari", designation: "LKG Teacher", phone: "9841518968", group: "General Staff" },
  { name: "Sabina Lamichhane", designation: "Nursery Teacher", phone: "9811422325", group: "General Staff" },
  { name: "Nanimaya Shrestha", designation: "Teacher", phone: "9841770199", group: "General Staff" },
  { name: "Samjhana Bhattarai", designation: "Librarian", phone: "9843354709", group: "General Staff" },
  { name: "Muna Khatri", designation: "Teacher", phone: "9842932108", group: "General Staff" },
  { name: "Parbati Sapkota", designation: "School Nurse", phone: "9841353048", group: "General Staff" },
  { name: "Hem Kumari Adhikari", designation: "Asst. (CDA)", phone: "9843130099", group: "General Staff" },
  { name: "Rita Karanjit", designation: "Asst. (CDA)", phone: "9843536102", group: "General Staff" },
  { name: "Dipen Chaudhary", designation: "Security Guard", phone: "9745597055", group: "General Staff" },
  { name: "Ritu Shrestha", designation: "Comp. Instructor", phone: "9862582324", group: "Computer Engineering" },
  { name: "Pintu Shah", designation: "Physics Instructor", phone: "9845552818", group: "Computer Engineering" },
  { name: "Punam Acharya", designation: "Chemistry Instructor", phone: "9867805281", group: "Computer Engineering" },
  { name: "Prashant Shrestha", designation: "Comp. Instructor", phone: "9840007761", group: "Computer Engineering" },
  { name: "Bhesh Bahadur Chauhan", designation: "Teacher (9B)", phone: "9849822946", group: "Computer Engineering" },
  { name: "Savin Dangol", designation: "Asst. Comp. Inst.", phone: "9741662666", group: "Computer Engineering" },
  { name: "Bhrugudevi Sapkota", designation: "Teacher", phone: "9841829736", group: "Part-time" },
  { name: "Surya Chapagai", designation: "Teacher", phone: "9849418760", group: "Part-time" },
  { name: "Anita Shrestha", designation: "Teacher", phone: "9849418760", group: "Part-time" },
  { name: "Prakash Shrestha", designation: "Teacher", phone: "9851184501", group: "Part-time" },
  { name: "Rupesh Budhathoki", designation: "Teacher", phone: "9841499458", group: "Part-time" },
];
