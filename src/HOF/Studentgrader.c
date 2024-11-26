#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct
{
    char name[50];
    int roll_number;
    float marks[5];
    float total_marks;
    float percentage;
    char grade[5];
    char result[10];
} StudentRecord;

float calculate_total_marks(float marks[], int size)
{
    float total = 0;
    for (int i = 0; i < size; i++)
    {
        total += marks[i];
    }
    return total;
}

void process_student_record(StudentRecord *student)
{

    student->total_marks = calculate_total_marks(student->marks, 5);

    student->percentage = (student->total_marks / 500.0) * 100.0;

    if (student->percentage >= 90)
    {
        strcpy(student->grade, "A+");
    }
    else if (student->percentage >= 80)
    {
        strcpy(student->grade, "A");
    }
    else if (student->percentage >= 70)
    {
        strcpy(student->grade, "B+");
    }
    else if (student->percentage >= 60)
    {
        strcpy(student->grade, "B");
    }
    else if (student->percentage >= 50)
    {
        strcpy(student->grade, "C");
    }
    else
    {
        strcpy(student->grade, "F");
    }

    int passed_subjects = 0;
    for (int i = 0; i < 5; i++)
    {
        if (student->marks[i] >= 35)
        {
            passed_subjects++;
        }
    }

    strcpy(student->result,
           (passed_subjects >= 3 && student->percentage >= 35.0) ? "PASS" : "FAIL");
}

void print_student_report(StudentRecord *student)
{
    printf("Student Academic Report\n");
    printf("======================\n");
    printf("Name: %s\n", student->name);
    printf("Roll Number: %d\n\n", student->roll_number);

    printf("Subject-wise Marks:\n");
    for (int i = 0; i < 5; i++)
    {
        printf("Subject %d: %.2f %s\n",
               i + 1,
               student->marks[i],
               student->marks[i] >= 35 ? "(PASS)" : "(FAIL)");
    }

    printf("\nOverall Performance:\n");
    printf("Total Marks: %.2f / 500\n", student->total_marks);
    printf("Percentage: %.2f%%\n", student->percentage);
    printf("Grade: %s\n", student->grade);
    printf("Result: %s\n", student->result);
}

int main(int argc, char *argv[])
{

    if (argc != 8)
    {
        fprintf(stderr, "Usage: %s <name> <roll_number> <mark1> <mark2> <mark3> <mark4> <mark5>\n", argv[0]);
        return 1;
    }

    StudentRecord student;

    strcpy(student.name, argv[1]);
    student.roll_number = atoi(argv[2]);

    for (int i = 0; i < 5; i++)
    {
        student.marks[i] = atof(argv[i + 3]);
    }

    process_student_record(&student);

    print_student_report(&student);

    return 0;
}