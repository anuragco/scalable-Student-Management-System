#include <iostream>
#include <cstdlib>
#include <cstring>

using namespace std;

struct StudentRecord {
    char name[50];
    int roll_number;
    float marks[5];
    float total_marks;
    float percentage;
    char grade[5];
    char result[10];
};

float calculate_total_marks(float marks[], int size) {
    float total = 0;
    for (int i = 0; i < size; i++) {
        total += marks[i];
    }
    return total;
}

void process_student_record(StudentRecord *student) {
    student->total_marks = calculate_total_marks(student->marks, 5);
    student->percentage = (student->total_marks / 500.0) * 100.0;

    if (student->percentage >= 90) {
        strcpy(student->grade, "A+");
    } else if (student->percentage >= 80) {
        strcpy(student->grade, "A");
    } else if (student->percentage >= 70) {
        strcpy(student->grade, "B+");
    } else if (student->percentage >= 60) {
        strcpy(student->grade, "B");
    } else if (student->percentage >= 50) {
        strcpy(student->grade, "C");
    } else {
        strcpy(student->grade, "F");
    }

    int passed_subjects = 0;
    for (int i = 0; i < 5; i++) {
        if (student->marks[i] >= 35) {
            passed_subjects++;
        }
    }

    strcpy(student->result, (passed_subjects >= 3 && student->percentage >= 35.0) ? "PASS" : "FAIL");
}

//for debugging
void print_student_report(const StudentRecord *student) {
    cout << "Student Academic Report" << endl;
    cout << "======================" << endl;
    cout << "Name: " << student->name << endl;
    cout << "Roll Number: " << student->roll_number << "\n" << endl;

    cout << "Subject-wise Marks:" << endl;
    for (int i = 0; i < 5; i++) {
        cout << "Subject " << i + 1 << ": " << student->marks[i] << " "
             << (student->marks[i] >= 35 ? "(PASS)" : "(FAIL)") << endl;
    }

    cout << "\nOverall Performance:" << endl;
    cout << "Total Marks: " << student->total_marks << " / 500" << endl;
    cout << "Percentage: " << student->percentage << "%" << endl;
    cout << "Grade: " << student->grade << endl;
    cout << "Result: " << student->result << endl;
}

int main(int argc, char *argv[]) {
    if (argc != 8) {
        cerr << "Usage: " << argv[0] << " <name> <roll_number> <mark1> <mark2> <mark3> <mark4> <mark5>" << endl;
        return 1;
    }

    StudentRecord student;
    strcpy(student.name, argv[1]);
    student.roll_number = atoi(argv[2]);

    for (int i = 0; i < 5; i++) {
        student.marks[i] = atof(argv[i + 3]);
    }

    process_student_record(&student);
    print_student_report(&student);

    return 0;
}
