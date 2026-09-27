import bcrypt from "bcrypt";

// First Mentor
const password = 'F@123m123';

const has0 = await bcrypt.hash(password,10);


// Second Mentor
const pass2 = 'S@123m123';
const has1 = await bcrypt.hash(pass2,10);

console.log(has1);