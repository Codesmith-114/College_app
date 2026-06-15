import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Attendance } from '../models/Attendance.js';
import { Task } from '../models/Task.js';

dotenv.config();

async function seedDatabase() {
    try {
        await connectDB();
        console.log('🌱 Starting database seed...\n');

        // Clear existing data
        await User.deleteMany({});
        await Attendance.deleteMany({});
        await Task.deleteMany({});
        console.log('✓ Cleared existing data');

        // Create sample users
        const user = await User.create({
            portalId: 'BIT2024001',
            encryptedPassword: 'password123', // Will be hashed automatically
            name: 'Alex Johnson',
            email: 'alex.johnson@college.edu',
            university: 'Tech University',
            department: 'Computer Science',
            semester: 5,
            rollNumber: '24001'
        });
        console.log('✓ Created sample user:', user.name);

        // Create attendance records
        const subjects = [
            { name: 'Data Structures', code: 'CS201', attended: 30, total: 35, professor: 'Dr. Smith' },
            { name: 'Cloud Computing', code: 'CS301', attended: 28, total: 35, professor: 'Dr. Wilson' },
            { name: 'Web Development', code: 'CS202', attended: 32, total: 35, professor: 'Prof. Brown' },
            { name: 'Databases', code: 'CS210', attended: 25, total: 35, professor: 'Dr. Lee' }
        ];

        const attendanceRecords = await Promise.all(
            subjects.map(subject =>
                Attendance.create({
                    userId: user._id,
                    subjectName: subject.name,
                    subjectCode: subject.code,
                    classesAttended: subject.attended,
                    totalClasses: subject.total,
                    mandateThreshold: 75,
                    professor: subject.professor,
                    semester: 5
                })
            )
        );
        console.log('✓ Created', attendanceRecords.length, 'attendance records');

        // Create sample tasks
        const today = new Date();
        const tasks = [
            {
                title: 'Data Structures Assignment 5',
                description: 'Complete the sorting algorithms implementation',
                dueDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                type: 'ASSIGNMENT',
                status: 'PENDING',
                priority: 'HIGH',
                subject: 'Data Structures'
            },
            {
                title: 'Cloud Computing Midterm Exam',
                description: 'Covers Cloud basics, AWS, and deployment strategies',
                dueDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                type: 'EXAM',
                status: 'PENDING',
                priority: 'HIGH',
                subject: 'Cloud Computing'
            },
            {
                title: 'Web Dev Project: E-commerce Site',
                description: 'Build a full-stack e-commerce website',
                dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
                type: 'PROJECT',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
                subject: 'Web Development'
            },
            {
                title: 'Database Schema Design',
                description: 'Design schema for the library management system',
                dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
                type: 'ASSIGNMENT',
                status: 'PENDING',
                priority: 'MEDIUM',
                subject: 'Databases'
            }
        ];

        const createdTasks = await Promise.all(
            tasks.map(task =>
                Task.create({ userId: user._id, ...task })
            )
        );
        console.log('✓ Created', createdTasks.length, 'sample tasks');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nTest Credentials:');
        console.log('Portal ID:', user.portalId);
        console.log('Password: password123');
        console.log('Email:', user.email);

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await disconnectDB();
    }
}

seedDatabase();
