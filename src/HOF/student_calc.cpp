#include <iostream>
#include <cstdlib>
#include <string>

using namespace std;

void calculateAttendance(int totalDays, int presentDays) {
    double percentage = (static_cast<double>(presentDays) / totalDays) * 100;
    cout << "{\n";
    cout << "  \"totalDays\": " << totalDays << ",\n";
    cout << "  \"presentDays\": " << presentDays << ",\n";
    cout << "  \"attendancePercentage\": " << percentage << "\n";
    cout << "}";
}

void calculateGrade(int marks) {
    char grade;
    
    if (marks >= 90) grade = 'A';
    else if (marks >= 80) grade = 'B';
    else if (marks >= 70) grade = 'C';
    else if (marks >= 60) grade = 'D';
    else grade = 'F';
    
    cout << "{\n";
    cout << "  \"marks\": " << marks << ",\n";
    cout << "  \"grade\": \"" << grade << "\"\n";
    cout << "}";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Error: Not enough arguments" << endl;
        return 1;
    }
    
    string option = argv[1];
    
    if (option == "attendance") {
        if (argc != 4) {
            cerr << "Error: Attendance needs total days and present days" << endl;
            return 1;
        }
        int totalDays = atoi(argv[2]);
        int presentDays = atoi(argv[3]);
        calculateAttendance(totalDays, presentDays);
    }
    else if (option == "grade") {
        if (argc != 3) {
            cerr << "Error: Grade needs marks" << endl;
            return 1;
        }
        int marks = atoi(argv[2]);
        calculateGrade(marks);
    }
    else {
        cerr << "Error: Invalid calculation type" << endl;
        return 1;
    }
    
    return 0;
}
