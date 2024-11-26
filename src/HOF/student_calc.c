#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void calculateAttendance(int totalDays, int presentDays) {
    double percentage = ((double)presentDays / totalDays) * 100;
    printf("{\n");
    printf("  \"totalDays\": %d,\n", totalDays);
    printf("  \"presentDays\": %d,\n", presentDays);
    printf("  \"attendancePercentage\": %.2f\n", percentage);
    printf("}");
}

void calculateGrade(int marks) {
    char grade;
    
    if (marks >= 90) grade = 'A';
    else if (marks >= 80) grade = 'B';
    else if (marks >= 70) grade = 'C';
    else if (marks >= 60) grade = 'D';
    else grade = 'F';
    
    printf("{\n");
    printf("  \"marks\": %d,\n", marks);
    printf("  \"grade\": \"%c\"\n", grade);
    printf("}");
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Error: Not enough arguments\n");
        return 1;
    }

    
    if (strcmp(argv[1], "attendance") == 0) {
        if (argc != 4) {
            printf("Error: Attendance needs total days and present days\n");
            return 1;
        }
        int totalDays = atoi(argv[2]);
        int presentDays = atoi(argv[3]);
        calculateAttendance(totalDays, presentDays);
    }
    else if (strcmp(argv[1], "grade") == 0) {
        if (argc != 3) {
            printf("Error: Grade needs marks\n");
            return 1;
        }
        int marks = atoi(argv[2]);
        calculateGrade(marks);
    }
    else {
        printf("Error: Invalid calculation type\n");
        return 1;
    }

    return 0;
}