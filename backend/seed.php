<?php
/**
 * PlaceIQ Database Seeder
 * Populates tables with initial real-world campus recruitment data
 */

require_once __DIR__ . '/config.php';

try {
    // 1. Execute Schema (Ensure clean drop to apply any column additions)
    $pdo->exec("DROP TABLE IF EXISTS interviews;");
    $pdo->exec("DROP TABLE IF EXISTS applications;");
    $pdo->exec("DROP TABLE IF EXISTS jobs;");
    $pdo->exec("DROP TABLE IF EXISTS companies;");
    $pdo->exec("DROP TABLE IF EXISTS students;");
    $pdo->exec("DROP TABLE IF EXISTS users;");

    $schema = file_get_contents(__DIR__ . '/db/schema.sql');
    $pdo->exec($schema);

    // 2. Seed Users
    $stmtUser = $pdo->prepare("
        INSERT INTO users (id, username, password, role, name, email, student_id, company_id)
        VALUES (:id, :username, :password, :role, :name, :email, :student_id, :company_id)
    ");

    $users = [
        ['usr-1', '1', '1', 'student', 'Student 1', 'student1@campus.edu', 'std-1', null],
        ['usr-2', '2', '2', 'student', 'Student 2', 'student2@campus.edu', 'std-2', null],
        ['usr-3', '3', '3', 'student', 'Student 3', 'student3@campus.edu', 'std-3', null],
        ['usr-admin', 'admin@placement.edu', 'admin123', 'officer', 'Dr. Aris Thorne', 'admin@placement.edu', null, null],
        ['usr-recruiter', 'campus-hiring@google.com', 'hiring123', 'company', 'Google India', 'campus-hiring@google.com', null, 'cmp-1']
    ];

    foreach ($users as $u) {
        $stmtUser->execute([
            ':id' => $u[0],
            ':username' => $u[1],
            ':password' => $u[2],
            ':role' => $u[3],
            ':name' => $u[4],
            ':email' => $u[5],
            ':student_id' => $u[6],
            ':company_id' => $u[7],
        ]);
    }

    // 3. Seed Students
    $stmtStudent = $pdo->prepare("
        INSERT INTO students (
            id, name, roll_no, email, phone, department, branch_code, cgpa, backlogs, passing_year,
            skills, status, placed_company, placed_package, resume_url, avatar, linkedin, github,
            headline, location, projects, certifications, education_10th, education_12th
        )
        VALUES (
            :id, :name, :roll_no, :email, :phone, :department, :branch_code, :cgpa, :backlogs, :passing_year,
            :skills, :status, :placed_company, :placed_package, :resume_url, :avatar, :linkedin, :github,
            :headline, :location, :projects, :certifications, :education_10th, :education_12th
        )
    ");

    $students = [
        [
            'id' => 'std-1',
            'name' => 'Student 1',
            'roll_no' => '1',
            'email' => 'student1@campus.edu',
            'phone' => '+91 98765 43210',
            'department' => 'Computer Science & Engineering',
            'branch_code' => 'CSE',
            'cgpa' => 9.40,
            'backlogs' => 0,
            'passing_year' => 2026,
            'skills' => json_encode(['React', 'Node.js', 'Python', 'AWS', 'Data Structures', 'SQL', 'System Design']),
            'status' => 'Seeking',
            'placed_company' => null,
            'placed_package' => null,
            'resume_url' => 'https://example.com/resumes/student1.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/student1',
            'github' => 'https://github.com/student1',
            'headline' => 'Aspiring Software Development Engineer & Cloud Systems Architect',
            'location' => 'Bengaluru / Hybrid, India',
            'projects' => json_encode([
                [
                    'title' => 'Distributed High-Throughput Task Processing Pipeline',
                    'tech' => 'Node.js • Redis • Docker • AWS S3',
                    'description' => 'Designed and deployed an asynchronous message queuing architecture handling 12,000+ jobs/sec with exponential backoff retries and dead-letter queues. Achieved sub-45ms execution response times with 99.98% reliability.'
                ],
                [
                    'title' => 'Full-Stack Campus Algorithmic Evaluation Engine',
                    'tech' => 'React • TypeScript • Tailwind • PostgreSQL',
                    'description' => 'Constructed automated code sandbox running C++, Java, and Python submissions against test cases in isolated containers. Integrated WebSocket channels for live leaderboard rendering during intra-college coding hackathons.'
                ]
            ]),
            'certifications' => json_encode([
                'AWS Certified Cloud Practitioner (Scored 910/1000)',
                'LeetCode Top 5% Rank (650+ Problems Solved)',
                'Finalist: National Smart Campus Hackathon 2025',
                'HackerRank 5-Star Gold Badge in Problem Solving & SQL'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'All India Secondary Exam',
                'score' => '96.2% (10.0 CGPA)',
                'details' => 'Top 1% Percentile Distinction'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'Central Board (CBSE / State)',
                'score' => '94.6%',
                'details' => 'Physics, Chemistry, Mathematics & CS'
            ])
        ],
        [
            'id' => 'std-2',
            'name' => 'Student 2',
            'roll_no' => '2',
            'email' => 'student2@campus.edu',
            'phone' => '+91 98234 56789',
            'department' => 'Electronics & Communication',
            'branch_code' => 'ECE',
            'cgpa' => 7.15,
            'backlogs' => 1,
            'passing_year' => 2026,
            'skills' => json_encode(['Embedded C', 'IoT', 'Python', 'MATLAB', 'VLSI', 'Verilog']),
            'status' => 'Seeking',
            'placed_company' => null,
            'placed_package' => null,
            'resume_url' => 'https://example.com/resumes/student2.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/student2',
            'github' => 'https://github.com/student2',
            'headline' => 'Embedded Systems & IoT Hardware Systems Engineer',
            'location' => 'Hyderabad / Chennai, India',
            'projects' => json_encode([
                [
                    'title' => 'Edge AI Smart Agricultural Sensor Mesh',
                    'tech' => 'Embedded C • ESP32 • LoRaWAN • Python',
                    'description' => 'Engineered mesh network of low-power soil moisture and microclimate telemetry nodes transmitting over 12km range. Reduced irrigation water consumption by 32%.'
                ],
                [
                    'title' => 'Autonomous Quadcopter Flight Controller with PID Tuning',
                    'tech' => 'STM32 • C++ • FreeRTOS • MPU6050',
                    'description' => 'Developed hard real-time flight telemetry firmware with Kalman filter sensor fusion and responsive stabilization loops running at 400Hz.'
                ]
            ]),
            'certifications' => json_encode([
                'ARM Cortex-M Embedded Systems Certification',
                'MATLAB & Simulink Specialist Credential',
                'First Place: Inter-College Robocon Circuit Design'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'State Secondary Board',
                'score' => '91.8%',
                'details' => 'Distinction in Sciences & Mathematics'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'State Higher Secondary Board',
                'score' => '89.4%',
                'details' => 'Electronics, Physics & Mathematics'
            ])
        ],
        [
            'id' => 'std-3',
            'name' => 'Student 3',
            'roll_no' => '3',
            'email' => 'student3@campus.edu',
            'phone' => '+91 91234 56780',
            'department' => 'Computer Science & Engineering',
            'branch_code' => 'CSE',
            'cgpa' => 9.35,
            'backlogs' => 0,
            'passing_year' => 2026,
            'skills' => json_encode(['Distributed Systems', 'Go', 'Rust', 'Kubernetes', 'Algorithms', 'C++']),
            'status' => 'Placed',
            'placed_company' => 'Microsoft',
            'placed_package' => '24.0 LPA',
            'resume_url' => 'https://example.com/resumes/student3.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/student3',
            'github' => 'https://github.com/student3',
            'headline' => 'Systems Programmer & Distributed Infrastructure Architect',
            'location' => 'Bengaluru / Pune, India',
            'projects' => json_encode([
                [
                    'title' => 'Raft Distributed Consensus Key-Value Store',
                    'tech' => 'Rust • Tokio • gRPC • RocksDB',
                    'description' => 'Implemented replicated state machine protocol with dynamic cluster membership changes, snapshot compaction, and high-performance log replication.'
                ],
                [
                    'title' => 'Zero-Copy Linux Kernel Packet Filtering Driver',
                    'tech' => 'C • eBPF • Linux Kernel • XDP',
                    'description' => 'Created line-rate packet filter dropping malicious SYN floods at NIC driver level, processing 14.8M packets/sec.'
                ]
            ]),
            'certifications' => json_encode([
                'Certified Kubernetes Application Developer (CKAD)',
                'Codeforces Candidate Master (Rating 1942)',
                'Winner: National Systems Programming Olympiad'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'ICSE Board',
                'score' => '95.4%',
                'details' => 'Top Tier Academic Honor Roll'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'ISC Board',
                'score' => '93.8%',
                'details' => 'Computer Science, Physics & Mathematics'
            ])
        ],
        [
            'id' => 'std-4',
            'name' => 'Ananya Patel',
            'roll_no' => '2022EC1077',
            'email' => 'ananya.patel@campus.edu',
            'phone' => '+91 97123 45678',
            'department' => 'Electronics & Communication',
            'branch_code' => 'ECE',
            'cgpa' => 7.95,
            'backlogs' => 0,
            'passing_year' => 2026,
            'skills' => json_encode(['Embedded C', 'IoT', 'Python', 'MATLAB', 'VLSI', 'Verilog']),
            'status' => 'Shortlisted',
            'placed_company' => null,
            'placed_package' => null,
            'resume_url' => 'https://example.com/resumes/ananya-patel.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/ananyapatel',
            'github' => 'https://github.com/ananyapatel',
            'headline' => 'VLSI Chip Design & Digital Electronics Specialist',
            'location' => 'Bengaluru, India',
            'projects' => json_encode([
                [
                    'title' => '32-Bit RISC-V Pipelined Microprocessor Core',
                    'tech' => 'Verilog • ModelSim • Vivado • FPGA',
                    'description' => 'Designed five-stage pipelined RV32I architecture with forwarding unit and branch hazard detection. Synthesized on Artix-7 FPGA target at 100MHz clock.'
                ]
            ]),
            'certifications' => json_encode([
                'Cadence VLSI Digital Design Specialist',
                'IEEE Student Technical Paper Award 2025'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'CBSE',
                'score' => '92.0%',
                'details' => 'First Division with Honors'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'CBSE',
                'score' => '90.5%',
                'details' => 'Mathematics & Electronics Stream'
            ])
        ],
        [
            'id' => 'std-5',
            'name' => 'Rohan Gupta',
            'roll_no' => '2022CS1091',
            'email' => 'rohan.gupta@campus.edu',
            'phone' => '+91 99887 66554',
            'department' => 'Computer Science & Engineering',
            'branch_code' => 'CSE',
            'cgpa' => 6.95,
            'backlogs' => 1,
            'passing_year' => 2026,
            'skills' => json_encode(['Web Development', 'JavaScript', 'HTML/CSS', 'MySQL', 'PHP']),
            'status' => 'Seeking',
            'placed_company' => null,
            'placed_package' => null,
            'resume_url' => 'https://example.com/resumes/rohan-gupta.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/rohangupta',
            'github' => 'https://github.com/rohangupta',
            'headline' => 'Full-Stack Web Architect & Database Engineer',
            'location' => 'Delhi NCR / Remote, India',
            'projects' => json_encode([
                [
                    'title' => 'Campus Placement & Recruiter Portal Backend',
                    'tech' => 'PHP • SQLite • MySQL • RESTful APIs',
                    'description' => 'Architected relational recruitment database schema with role-based JWT authentication, automated eligibility triggers, and high concurrency PDO query handlers.'
                ]
            ]),
            'certifications' => json_encode([
                'Oracle Certified Associate: Database SQL',
                'Full-Stack Web Development Nanodegree'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'CBSE',
                'score' => '88.6%',
                'details' => 'Distinction in Computer Applications'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'CBSE',
                'score' => '86.2%',
                'details' => 'Computer Science & Mathematics'
            ])
        ],
        [
            'id' => 'std-6',
            'name' => 'Sneha Reddy',
            'roll_no' => '2022ME1004',
            'email' => 'sneha.reddy@campus.edu',
            'phone' => '+91 96543 21098',
            'department' => 'Mechanical Engineering',
            'branch_code' => 'MECH',
            'cgpa' => 7.65,
            'backlogs' => 0,
            'passing_year' => 2026,
            'skills' => json_encode(['SolidWorks', 'AutoCAD', 'Thermal Engineering', 'MATLAB', 'Lean Mfg']),
            'status' => 'Placed',
            'placed_company' => 'Tata Motors',
            'placed_package' => '12.0 LPA',
            'resume_url' => 'https://example.com/resumes/sneha-reddy.pdf',
            'avatar' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
            'linkedin' => 'https://linkedin.com/in/snehareddy',
            'github' => 'https://github.com/snehareddy',
            'headline' => 'Mechanical Systems & CAD / FEA Simulation Engineer',
            'location' => 'Pune / Bengaluru, India',
            'projects' => json_encode([
                [
                    'title' => 'Electric Vehicle Battery Enclosure Thermal Dissipation',
                    'tech' => 'SolidWorks • ANSYS Fluent • MATLAB',
                    'description' => 'Modeled liquid-cooling jacket geometry optimizing heat dissipation under peak discharge cycles, reducing hotspot variance by 4.2°C.'
                ],
                [
                    'title' => 'Lightweight Robotic Arm Kinematic Synthesis',
                    'tech' => 'AutoCAD • Simscape • Finite Element Analysis',
                    'description' => 'Topology-optimized 6-DOF robotic manipulator arm achieving 28% mass reduction while maintaining structural safety factor > 2.5.'
                ]
            ]),
            'certifications' => json_encode([
                'Certified SOLIDWORKS Professional (CSWP)',
                'ANSYS Mechanical FEA Credential',
                'SAE BAJA National Team Lead 2025'
            ]),
            'education_10th' => json_encode([
                'title' => 'Secondary School (Class X)',
                'board' => 'State Board',
                'score' => '93.2%',
                'details' => 'Academic Excellence Award'
            ]),
            'education_12th' => json_encode([
                'title' => 'Senior Secondary (Class XII)',
                'board' => 'State Higher Secondary',
                'score' => '91.0%',
                'details' => 'Physics, Chemistry & Applied Mechanics'
            ])
        ]
    ];

    foreach ($students as $s) {
        $stmtStudent->execute([
            ':id' => $s['id'],
            ':name' => $s['name'],
            ':roll_no' => $s['roll_no'],
            ':email' => $s['email'],
            ':phone' => $s['phone'],
            ':department' => $s['department'],
            ':branch_code' => $s['branch_code'],
            ':cgpa' => $s['cgpa'],
            ':backlogs' => $s['backlogs'],
            ':passing_year' => $s['passing_year'],
            ':skills' => $s['skills'],
            ':status' => $s['status'],
            ':placed_company' => $s['placed_company'],
            ':placed_package' => $s['placed_package'],
            ':resume_url' => $s['resume_url'],
            ':avatar' => $s['avatar'],
            ':linkedin' => $s['linkedin'],
            ':github' => $s['github'],
            ':headline' => $s['headline'],
            ':location' => $s['location'],
            ':projects' => $s['projects'],
            ':certifications' => $s['certifications'],
            ':education_10th' => $s['education_10th'],
            ':education_12th' => $s['education_12th']
        ]);
    }

    // 4. Seed Companies
    $stmtCompany = $pdo->prepare("
        INSERT INTO companies (id, name, industry, website, location, hr_contact, email, tier, status, logo, total_hires, avg_package, description)
        VALUES (:id, :name, :industry, :website, :location, :hr_contact, :email, :tier, :status, :logo, :total_hires, :avg_package, :description)
    ");

    $companies = [
        [
            'id' => 'cmp-1',
            'name' => 'Google India',
            'industry' => 'Technology / Cloud / AI',
            'website' => 'https://careers.google.com',
            'location' => 'Bengaluru / Hyderabad',
            'hr_contact' => 'Siddharth Sen (University Recruiter)',
            'email' => 'campus-hiring@google.com',
            'tier' => 'Tier 1 (Dream)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
            'total_hires' => 18,
            'avg_package' => '28.5 LPA',
            'description' => 'Google organizes the world’s information and makes it universally accessible and useful.'
        ],
        [
            'id' => 'cmp-2',
            'name' => 'Microsoft IDC',
            'industry' => 'Cloud Computing / Enterprise Software',
            'website' => 'https://careers.microsoft.com',
            'location' => 'Bengaluru / Hyderabad / Noida',
            'hr_contact' => 'Kavita Menon (Talent Acquisition Lead)',
            'email' => 'idc-recruitment@microsoft.com',
            'tier' => 'Tier 1 (Dream)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
            'total_hires' => 24,
            'avg_package' => '22.0 LPA',
            'description' => 'Microsoft enables digital transformation for the era of an intelligent cloud and intelligent edge.'
        ],
        [
            'id' => 'cmp-3',
            'name' => 'Amazon Development Centre',
            'industry' => 'E-Commerce / Cloud (AWS)',
            'website' => 'https://amazon.jobs',
            'location' => 'Bengaluru / Chennai / Hyderabad',
            'hr_contact' => 'Rajeev Nambiar (Campus HR Head)',
            'email' => 'campus-india@amazon.com',
            'tier' => 'Tier 1 (Dream)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
            'total_hires' => 32,
            'avg_package' => '24.5 LPA',
            'description' => 'Guided by customer obsession rather than competitor focus, Amazon builds planet-scale infrastructure.'
        ],
        [
            'id' => 'cmp-4',
            'name' => 'Cisco Systems',
            'industry' => 'Networking / Cyber Security / IoT',
            'website' => 'https://cisco.com/careers',
            'location' => 'Bengaluru',
            'hr_contact' => 'Debashish Ray (Senior Director - Talent)',
            'email' => 'india-campus@cisco.com',
            'tier' => 'Tier 2 (Core)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg',
            'total_hires' => 28,
            'avg_package' => '16.5 LPA',
            'description' => 'Cisco is the worldwide technology leader that securely connects everything to make anything possible.'
        ],
        [
            'id' => 'cmp-5',
            'name' => 'Deloitte USI',
            'industry' => 'Consulting / Analytics / Advisory',
            'website' => 'https://deloitte.com/careers',
            'location' => 'Hyderabad / Mumbai / Bengaluru',
            'hr_contact' => 'Meenakshi Sundaram (Campus Lead)',
            'email' => 'usi-campus@deloitte.com',
            'tier' => 'Tier 2 (Core)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg',
            'total_hires' => 42,
            'avg_package' => '11.0 LPA',
            'description' => 'Deloitte drives progress through global consulting, analytics, and digital transformation.'
        ],
        [
            'id' => 'cmp-6',
            'name' => 'TCS Digital',
            'industry' => 'IT & Digital Engineering',
            'website' => 'https://tcs.com/careers',
            'location' => 'Pan India',
            'hr_contact' => 'Pradeep Iyer (Campus Lead)',
            'email' => 'campus.tcs@tcs.com',
            'tier' => 'Tier 3 (Mass / IT)',
            'status' => 'Active',
            'logo' => 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg',
            'total_hires' => 95,
            'avg_package' => '7.5 LPA',
            'description' => 'A global leader in IT services, consulting, and business solutions.'
        ]
    ];

    foreach ($companies as $c) {
        $stmtCompany->execute([
            ':id' => $c['id'],
            ':name' => $c['name'],
            ':industry' => $c['industry'],
            ':website' => $c['website'],
            ':location' => $c['location'],
            ':hr_contact' => $c['hr_contact'],
            ':email' => $c['email'],
            ':tier' => $c['tier'],
            ':status' => $c['status'],
            ':logo' => $c['logo'],
            ':total_hires' => $c['total_hires'],
            ':avg_package' => $c['avg_package'],
            ':description' => $c['description']
        ]);
    }

    // 5. Seed Jobs
    $stmtJob = $pdo->prepare("
        INSERT INTO jobs (id, company_id, company_name, title, type, role, location, package_ctc, package_display, stipend, min_cgpa, allowed_branches, max_backlogs, deadline, posted_date, status, vacancies, rounds, description)
        VALUES (:id, :company_id, :company_name, :title, :type, :role, :location, :package_ctc, :package_display, :stipend, :min_cgpa, :allowed_branches, :max_backlogs, :deadline, :posted_date, :status, :vacancies, :rounds, :description)
    ");

    $jobs = [
        [
            'id' => 'job-1',
            'company_id' => 'cmp-1',
            'company_name' => 'Google India',
            'title' => 'Software Development Engineer - I (SDE 1)',
            'type' => 'Full-time',
            'role' => 'Frontend / Backend / Full Stack',
            'location' => 'Bengaluru / Hyderabad',
            'package_ctc' => 28.5,
            'package_display' => '₹28.5 LPA',
            'stipend' => '₹1,20,000 / month (Internship)',
            'min_cgpa' => 8.0,
            'allowed_branches' => json_encode(['CSE', 'IT']),
            'max_backlogs' => 0,
            'deadline' => '2026-11-15',
            'posted_date' => '2026-10-18',
            'status' => 'Open',
            'vacancies' => 8,
            'rounds' => json_encode(['Online Assessment (DSA + Coding)', 'Technical Interview 1', 'Technical Interview 2', 'Googliness & Leadership']),
            'description' => 'Join Google core engineering teams building scalable platforms used by billions of users worldwide.'
        ],
        [
            'id' => 'job-2',
            'company_id' => 'cmp-2',
            'company_name' => 'Microsoft IDC',
            'title' => 'Support & Cloud Solutions Engineer',
            'type' => 'Full-time',
            'role' => 'Azure Cloud / DevOps',
            'location' => 'Bengaluru / Hyderabad / Noida',
            'package_ctc' => 22.0,
            'package_display' => '₹22.0 LPA',
            'stipend' => '₹95,000 / month',
            'min_cgpa' => 7.5,
            'allowed_branches' => json_encode(['CSE', 'IT', 'ECE']),
            'max_backlogs' => 0,
            'deadline' => '2026-11-20',
            'posted_date' => '2026-10-20',
            'status' => 'Open',
            'vacancies' => 12,
            'rounds' => json_encode(['Coding Challenge (Codility)', 'Technical Discussion (OS + Networking)', 'Cloud Architecture Round', 'Director Round']),
            'description' => 'Design and optimize mission-critical cloud solutions on Microsoft Azure.'
        ],
        [
            'id' => 'job-3',
            'company_id' => 'cmp-3',
            'company_name' => 'Amazon Development Centre',
            'title' => 'Software Development Engineer (AWS SDE)',
            'type' => 'Full-time',
            'role' => 'Cloud Services & Distributed Data',
            'location' => 'Bengaluru / Chennai',
            'package_ctc' => 24.5,
            'package_display' => '₹24.5 LPA',
            'stipend' => '₹1,10,000 / month',
            'min_cgpa' => 7.5,
            'allowed_branches' => json_encode(['CSE', 'IT']),
            'max_backlogs' => 0,
            'deadline' => '2026-11-25',
            'posted_date' => '2026-10-22',
            'status' => 'Open',
            'vacancies' => 15,
            'rounds' => json_encode(['Online Coding Test', 'DSA & System Design', 'Bar Raiser Round', 'Behavioral Leadership']),
            'description' => 'Build ultra-high throughput services powering Amazon AWS, Prime Video, and Alexa.'
        ],
        [
            'id' => 'job-4',
            'company_id' => 'cmp-4',
            'company_name' => 'Cisco Systems',
            'title' => 'Associate Consulting Systems Engineer (CSE)',
            'type' => 'Full-time',
            'role' => 'Networking / Cyber Security',
            'location' => 'Bengaluru',
            'package_ctc' => 16.5,
            'package_display' => '₹16.5 LPA',
            'stipend' => '₹65,000 / month',
            'min_cgpa' => 7.0,
            'allowed_branches' => json_encode(['CSE', 'IT', 'ECE']),
            'max_backlogs' => 1,
            'deadline' => '2026-11-30',
            'posted_date' => '2026-10-24',
            'status' => 'Open',
            'vacancies' => 20,
            'rounds' => json_encode(['Aptitude & Technical MCQ', 'Cisco Technical Interview', 'Managerial Interview', 'HR Round']),
            'description' => 'Help global enterprises transform their digital networks with Cisco SDN and zero-trust cybersecurity.'
        ],
        [
            'id' => 'job-5',
            'company_id' => 'cmp-5',
            'company_name' => 'Deloitte USI',
            'title' => 'Business Technology Analyst (BTA)',
            'type' => 'Full-time',
            'role' => 'Consulting & Analytics',
            'location' => 'Hyderabad / Mumbai / Gurugram',
            'package_ctc' => 11.0,
            'package_display' => '₹11.0 LPA',
            'stipend' => '₹40,000 / month',
            'min_cgpa' => 6.5,
            'allowed_branches' => json_encode(['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE']),
            'max_backlogs' => 1,
            'deadline' => '2026-12-05',
            'posted_date' => '2026-10-25',
            'status' => 'Open',
            'vacancies' => 35,
            'rounds' => json_encode(['Deloitte Aptitude & Verbal Test', 'Case Study Assessment', 'Partner Technical Round', 'HR Evaluation']),
            'description' => 'Collaborate with Fortune 500 executives to deliver strategic digital transformation and analytics.'
        ],
        [
            'id' => 'job-6',
            'company_id' => 'cmp-6',
            'company_name' => 'TCS Digital',
            'title' => 'Digital Systems Engineer',
            'type' => 'Full-time',
            'role' => 'Full Stack & AI Development',
            'location' => 'Pan India',
            'package_ctc' => 7.5,
            'package_display' => '₹7.5 LPA',
            'stipend' => '₹25,000 / month',
            'min_cgpa' => 6.0,
            'allowed_branches' => json_encode(['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE']),
            'max_backlogs' => 2,
            'deadline' => '2026-12-15',
            'posted_date' => '2026-10-26',
            'status' => 'Open',
            'vacancies' => 60,
            'rounds' => json_encode(['TCS NQT Advanced Cognitive & Coding', 'Technical Interview', 'Managerial & HR Interview']),
            'description' => 'Spearhead next-generation application development, IoT platforms, and digital client initiatives.'
        ]
    ];

    foreach ($jobs as $j) {
        $stmtJob->execute([
            ':id' => $j['id'],
            ':company_id' => $j['company_id'],
            ':company_name' => $j['company_name'],
            ':title' => $j['title'],
            ':type' => $j['type'],
            ':role' => $j['role'],
            ':location' => $j['location'],
            ':package_ctc' => $j['package_ctc'],
            ':package_display' => $j['package_display'],
            ':stipend' => $j['stipend'],
            ':min_cgpa' => $j['min_cgpa'],
            ':allowed_branches' => $j['allowed_branches'],
            ':max_backlogs' => $j['max_backlogs'],
            ':deadline' => $j['deadline'],
            ':posted_date' => $j['posted_date'],
            ':status' => $j['status'],
            ':vacancies' => $j['vacancies'],
            ':rounds' => $j['rounds'],
            ':description' => $j['description']
        ]);
    }

    // 6. Seed Applications
    $stmtApp = $pdo->prepare("
        INSERT INTO applications (id, job_id, student_id, student_name, student_roll, student_branch, student_cgpa, company_id, company_name, job_title, applied_date, status, offered_package, notes, interview_round)
        VALUES (:id, :job_id, :student_id, :student_name, :student_roll, :student_branch, :student_cgpa, :company_id, :company_name, :job_title, :applied_date, :status, :offered_package, :notes, :interview_round)
    ");

    $apps = [
        [
            'id' => 'app-1',
            'job_id' => 'job-1',
            'student_id' => 'std-1',
            'student_name' => 'Student 1',
            'student_roll' => '1',
            'student_branch' => 'CSE',
            'student_cgpa' => 9.40,
            'company_id' => 'cmp-1',
            'company_name' => 'Google India',
            'job_title' => 'Software Development Engineer - I (SDE 1)',
            'applied_date' => '2026-10-19',
            'status' => 'Offered',
            'offered_package' => '₹28.5 LPA',
            'notes' => 'Exceptional performance in algorithmic problem solving and system scalability. Tier 1 Dream Offer.',
            'interview_round' => 'Final HR / Offer Extended'
        ],
        [
            'id' => 'app-1b',
            'job_id' => 'job-2',
            'student_id' => 'std-1',
            'student_name' => 'Student 1',
            'student_roll' => '1',
            'student_branch' => 'CSE',
            'student_cgpa' => 9.40,
            'company_id' => 'cmp-2',
            'company_name' => 'Microsoft IDC',
            'job_title' => 'Azure Cloud / DevOps',
            'applied_date' => '2026-10-21',
            'status' => 'Interview',
            'offered_package' => null,
            'notes' => 'Scored 98 percentile in Codility coding assessment. Shortlisted for Cloud Architecture Round.',
            'interview_round' => 'Round 3: System Design & Cloud Scalability'
        ],
        [
            'id' => 'app-2',
            'job_id' => 'job-4',
            'student_id' => 'std-2',
            'student_name' => 'Student 2',
            'student_roll' => '2',
            'student_branch' => 'ECE',
            'student_cgpa' => 7.15,
            'company_id' => 'cmp-4',
            'company_name' => 'Cisco Systems',
            'job_title' => 'Associate Consulting Systems Engineer (CSE)',
            'applied_date' => '2026-10-22',
            'status' => 'Interview',
            'offered_package' => null,
            'notes' => 'Cleared technical round 1 with high proficiency in core networking. Meets CGPA criteria (7.15 >= 7.0).',
            'interview_round' => 'Technical Interview 2 - Core Networking'
        ],
        [
            'id' => 'app-2b',
            'job_id' => 'job-6',
            'student_id' => 'std-2',
            'student_name' => 'Student 2',
            'student_roll' => '2',
            'student_branch' => 'ECE',
            'student_cgpa' => 7.15,
            'company_id' => 'cmp-6',
            'company_name' => 'TCS Digital',
            'job_title' => 'Digital Systems Engineer',
            'applied_date' => '2026-10-24',
            'status' => 'Screened',
            'offered_package' => null,
            'notes' => 'Cognitive and digital programming evaluation cleared.',
            'interview_round' => 'Awaiting Technical Evaluation Schedule'
        ],
        [
            'id' => 'app-3',
            'job_id' => 'job-2',
            'student_id' => 'std-3',
            'student_name' => 'Student 3',
            'student_roll' => '3',
            'student_branch' => 'CSE',
            'student_cgpa' => 9.35,
            'company_id' => 'cmp-2',
            'company_name' => 'Microsoft IDC',
            'job_title' => 'Support & Cloud Solutions Engineer',
            'applied_date' => '2026-10-20',
            'status' => 'Offered',
            'offered_package' => '₹24.0 LPA',
            'notes' => 'Accepted formal offer letter. Top performer in university recruitment cohort.',
            'interview_round' => 'Final Selection Completed'
        ],
        [
            'id' => 'app-4',
            'job_id' => 'job-5',
            'student_id' => 'std-4',
            'student_name' => 'Ananya Patel',
            'student_roll' => '2022EC1077',
            'student_branch' => 'ECE',
            'student_cgpa' => 7.95,
            'company_id' => 'cmp-5',
            'company_name' => 'Deloitte USI',
            'job_title' => 'Business Technology Analyst (BTA)',
            'applied_date' => '2026-10-25',
            'status' => 'Applied',
            'offered_package' => null,
            'notes' => 'Application registered; eligibility confirmed (CGPA >= 6.5).',
            'interview_round' => 'Application Under Review'
        ]
    ];

    foreach ($apps as $a) {
        $stmtApp->execute([
            ':id' => $a['id'],
            ':job_id' => $a['job_id'],
            ':student_id' => $a['student_id'],
            ':student_name' => $a['student_name'],
            ':student_roll' => $a['student_roll'],
            ':student_branch' => $a['student_branch'],
            ':student_cgpa' => $a['student_cgpa'],
            ':company_id' => $a['company_id'],
            ':company_name' => $a['company_name'],
            ':job_title' => $a['job_title'],
            ':applied_date' => $a['applied_date'],
            ':status' => $a['status'],
            ':offered_package' => $a['offered_package'],
            ':notes' => $a['notes'],
            ':interview_round' => $a['interview_round']
        ]);
    }

    // 7. Seed Interviews
    $stmtInt = $pdo->prepare("
        INSERT INTO interviews (id, job_id, student_id, student_name, student_roll, company_name, round_name, date, time, venue_or_link, interviewer, status, instructions)
        VALUES (:id, :job_id, :student_id, :student_name, :student_roll, :company_name, :round_name, :date, :time, :venue_or_link, :interviewer, :status, :instructions)
    ");

    $interviews = [
        [
            'id' => 'int-1',
            'job_id' => 'job-4',
            'student_id' => 'std-2',
            'student_name' => 'Student 2',
            'student_roll' => '2',
            'company_name' => 'Cisco Systems',
            'round_name' => 'Round 2: Core Networking & Protocol Design',
            'date' => '2026-10-29',
            'time' => '11:00 AM - 12:00 PM',
            'venue_or_link' => 'Placement Block Room 302 / Webex Meeting',
            'interviewer' => 'Debashish Ray (Systems Engineer Leader)',
            'status' => 'Scheduled',
            'instructions' => 'Prepare code walk-through of your capstone IoT & networking repository.'
        ],
        [
            'id' => 'int-2',
            'job_id' => 'job-1',
            'student_id' => 'std-1',
            'student_name' => 'Student 1',
            'student_roll' => '1',
            'company_name' => 'Google India',
            'round_name' => 'Offer Rollout & Executive Welcome Orientation',
            'date' => '2026-10-27',
            'time' => '04:00 PM - 05:00 PM',
            'venue_or_link' => 'https://meet.google.com/xyz-placement-google',
            'interviewer' => 'Siddharth Sen (University Recruitment Lead)',
            'status' => 'Completed',
            'instructions' => 'Review candidate employment declaration form and sign digitally.'
        ],
        [
            'id' => 'int-3',
            'job_id' => 'job-2',
            'student_id' => 'std-1',
            'student_name' => 'Student 1',
            'student_roll' => '1',
            'company_name' => 'Microsoft IDC',
            'round_name' => 'Round 3: System Design & Cloud Scalability',
            'date' => '2026-10-31',
            'time' => '02:00 PM - 03:00 PM',
            'venue_or_link' => 'https://teams.microsoft.com/l/meetup-join/pms-interview-student1',
            'interviewer' => 'Kavita Menon (Talent Acquisition & Cloud Lead)',
            'status' => 'Scheduled',
            'instructions' => 'Bring your distributed systems architecture diagrams.'
        ],
        [
            'id' => 'int-4',
            'job_id' => 'job-2',
            'student_id' => 'std-3',
            'student_name' => 'Student 3',
            'student_roll' => '3',
            'company_name' => 'Microsoft IDC',
            'round_name' => 'Executive Director Orientation',
            'date' => '2026-10-30',
            'time' => '10:00 AM - 11:00 AM',
            'venue_or_link' => 'https://teams.microsoft.com/l/meetup-join/pms-interview-student3',
            'interviewer' => 'Kavita Menon (Talent Acquisition Lead)',
            'status' => 'Completed',
            'instructions' => 'Final onboarding paperwork review.'
        ]
    ];

    foreach ($interviews as $i) {
        $stmtInt->execute([
            ':id' => $i['id'],
            ':job_id' => $i['job_id'],
            ':student_id' => $i['student_id'],
            ':student_name' => $i['student_name'],
            ':student_roll' => $i['student_roll'],
            ':company_name' => $i['company_name'],
            ':round_name' => $i['round_name'],
            ':date' => $i['date'],
            ':time' => $i['time'],
            ':venue_or_link' => $i['venue_or_link'],
            ':interviewer' => $i['interviewer'],
            ':status' => $i['status'],
            ':instructions' => $i['instructions']
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Database successfully initialized and seeded with recruitment records!',
        'counts' => [
            'users' => count($users),
            'students' => count($students),
            'companies' => count($companies),
            'jobs' => count($jobs),
            'applications' => count($apps),
            'interviews' => count($interviews),
        ]
    ], JSON_PRETTY_PRINT) . PHP_EOL;

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT) . PHP_EOL;
}
