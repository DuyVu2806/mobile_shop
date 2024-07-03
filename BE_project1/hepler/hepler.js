const generateRandomString = (length) => {
  const characters = "0123456789";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
};
const randomCode = (length) => {
  const characters = "0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
  let randomString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
};

const createSlug = (name) => {
  const random = generateRandomString(6);
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s/g, "-")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9-]/g, "");

  return `${slug}-${random}`;
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmail = (email) => {
  return emailRegex.test(email);
};
const phoneNumberRegex = /^(84|0[3|5|7|8|9])+([0-9]{8,9})\b/;
const isPhoneNumber = (phoneNumber) => {
  console.log(phoneNumberRegex.test(phoneNumber));
  return phoneNumberRegex.test(phoneNumber);
};
export { createSlug, isEmail, isPhoneNumber, randomCode };
