let students = [];

for (let i = 0; i < 10; i++) {
  let student = {};
  student.name = generateRandomName();
  student.marks = generateRandomMarks();
  student.total = student.marks.reduce((a,b)=>a + b, 0);
  students.push(student);
}

function generateRandomName() {
  let names = ["John", "Emma", "Michael", "Sarah", "David", "Olivia", "Liam", "Emily", "James", "Sophia"];
  let randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

function generateRandomMarks() {
    let marks = [];
    for (let i = 0; i < 5; i++) {
      marks.push(Math.floor(Math.random() * 101));
    }
    return marks;
  }
console.log(students);
