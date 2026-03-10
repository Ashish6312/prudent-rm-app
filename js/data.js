// ─────────────────────────────────────────────
// PRUDENT MF – Mock Data
// ─────────────────────────────────────────────

const APP_DATA = {

    // ── RM Profiles (login simulation) ──────────
    users: [
        {
            id: 'rm001',
            name: 'Rajesh Kumar',
            empId: 'PMF1042',
            password: '1234',
            role: 'RM',
            avatar: 'RK',
            zone: 'West',
            region: 'Mumbai',
            cluster: 'Andheri Cluster',
            area: 'Andheri West',
            totalCPs: 28,
            reportingTo: 'Sunita Sharma (Sr. RM)'
        },
        {
            id: 'srm001',
            name: 'Sunita Sharma',
            empId: 'PMF0821',
            password: '1234',
            role: 'Senior RM',
            avatar: 'SS',
            zone: 'West',
            region: 'Mumbai',
            cluster: 'Andheri Cluster',
            area: 'Andheri Belt',
            totalCPs: 72,
            reportingTo: 'Vikram Mehta (Area Manager)'
        },
        {
            id: 'am001',
            name: 'Vikram Mehta',
            empId: 'PMF0514',
            password: '1234',
            role: 'Area Manager',
            avatar: 'VM',
            zone: 'West',
            region: 'Mumbai',
            cluster: 'All Clusters – Mumbai',
            area: 'All Areas – Mumbai',
            totalCPs: 210,
            reportingTo: 'Priya Nair (Regional Manager)'
        }
    ],

    // ── Hierarchy Tree ────────────────────────────
    hierarchy: {
        zone: 'West',
        region: 'Mumbai',
        cluster: 'Andheri Cluster',
        area: 'Andheri West',
        tree: [
            {
                id: 'rm001', name: 'Rajesh Kumar', role: 'RM',
                cps: 28, aum: 42.6, level: 3
            },
            {
                id: 'srm001', name: 'Sunita Sharma', role: 'Senior RM',
                cps: 72, aum: 138.4, level: 2
            },
            {
                id: 'am001', name: 'Vikram Mehta', role: 'Area Manager',
                cps: 210, aum: 412.8, level: 1
            },
            {
                id: 'rm002', name: 'Arjun Patel', role: 'RM',
                cps: 22, aum: 31.2, level: 3
            },
            {
                id: 'rm003', name: 'Pooja Singh', role: 'RM',
                cps: 19, aum: 26.8, level: 3
            }
        ]
    },

    // ── Channel Partners ──────────────────────────
    channelPartners: [
        {
            id: 'cp001',
            name: 'Mahindra Wealth Advisors',
            arn: 'ARN-089234',
            city: 'Mumbai',
            area: 'Andheri West',
            contactPerson: 'Suresh Mahindra',
            mobile: '9821045678',
            email: 'suresh@mahindrawealth.com',
            status: 'Active',
            empanelmentDate: '2019-04-12',
            lastContact: '2026-03-08',
            assignedRM: 'rm001',
            aum: { current: 8.4, previous: 7.6, lastYear: 5.2 },
            growth: { mom: 10.5, yoy: 61.5 },
            sips: { active: 142, amount: 3.2 },
            newFolios: { mtd: 8, ytd: 42 },
            transactions: { mtd: 67, ytd: 312 },
            schemes: [
                { name: 'Equity Large Cap', aum: 3.2, pct: 38 },
                { name: 'Hybrid Balanced', aum: 2.1, pct: 25 },
                { name: 'Debt Short Term', aum: 1.8, pct: 21 },
                { name: 'ELSS', aum: 0.9, pct: 11 },
                { name: 'Liquid', aum: 0.4, pct: 5 }
            ],
            callHistory: [
                { date: '2026-03-08', outcome: 'Positive', notes: 'Discussed new ELSS schemes. CP interested in increasing SIP business. Follow-up scheduled.', nextFollowUp: '2026-03-15' },
                { date: '2026-02-22', outcome: 'Neutral', notes: 'Market concerns from CP. Shared performance report. CP wants to review before new recommendations.', nextFollowUp: '2026-03-08' },
                { date: '2026-02-05', outcome: 'Positive', notes: 'Successful onboarding of 3 new clients. CP praised quick processing.', nextFollowUp: '2026-02-22' }
            ]
        },
        {
            id: 'cp002',
            name: 'Greenfield Financial Services',
            arn: 'ARN-054198',
            city: 'Mumbai',
            area: 'Goregaon East',
            contactPerson: 'Anita Goyal',
            mobile: '9867453210',
            email: 'anita@greenfieldfs.com',
            status: 'Active',
            empanelmentDate: '2021-07-01',
            lastContact: '2026-03-05',
            assignedRM: 'rm001',
            aum: { current: 5.7, previous: 5.1, lastYear: 3.8 },
            growth: { mom: 11.8, yoy: 50.0 },
            sips: { active: 98, amount: 2.1 },
            newFolios: { mtd: 5, ytd: 28 },
            transactions: { mtd: 44, ytd: 198 },
            schemes: [
                { name: 'Equity Mid Cap', aum: 2.4, pct: 42 },
                { name: 'Equity Large Cap', aum: 1.7, pct: 30 },
                { name: 'Hybrid', aum: 0.9, pct: 16 },
                { name: 'ELSS', aum: 0.7, pct: 12 }
            ],
            callHistory: [
                { date: '2026-03-05', outcome: 'Positive', notes: 'CP requested scheme comparison for Mid Cap vs. Flexi Cap. To share tomorrow.', nextFollowUp: '2026-03-12' },
                { date: '2026-02-18', outcome: 'Positive', notes: 'New SIP campaign briefed. CP willing to push to 10 new clients.', nextFollowUp: '2026-03-05' }
            ]
        },
        {
            id: 'cp003',
            name: 'Kapoor Investments',
            arn: 'ARN-112847',
            city: 'Mumbai',
            area: 'Andheri East',
            contactPerson: 'Ramesh Kapoor',
            mobile: '9920183746',
            email: 'ramesh@kapoorinv.com',
            status: 'Active',
            empanelmentDate: '2018-11-20',
            lastContact: '2026-02-28',
            assignedRM: 'rm001',
            aum: { current: 11.2, previous: 10.4, lastYear: 8.1 },
            growth: { mom: 7.7, yoy: 38.3 },
            sips: { active: 210, amount: 4.8 },
            newFolios: { mtd: 12, ytd: 68 },
            transactions: { mtd: 102, ytd: 524 },
            schemes: [
                { name: 'Equity Large Cap', aum: 4.5, pct: 40 },
                { name: 'Equity Mid Cap', aum: 2.8, pct: 25 },
                { name: 'Debt Long Term', aum: 1.9, pct: 17 },
                { name: 'Hybrid', aum: 1.4, pct: 13 },
                { name: 'Liquid', aum: 0.6, pct: 5 }
            ],
            callHistory: [
                { date: '2026-02-28', outcome: 'Positive', notes: 'Top CP. Discussed expanding NFO push. Very receptive. Target 30 new SIPs this month.', nextFollowUp: '2026-03-10' },
                { date: '2026-02-10', outcome: 'Neutral', notes: 'CP asked about redemption trends. Some clients exiting equity. Counselled on long-term SIP benefits.', nextFollowUp: '2026-02-28' }
            ]
        },
        {
            id: 'cp004',
            name: 'Sinha Wealth Management',
            arn: 'ARN-073621',
            city: 'Thane',
            area: 'Thane West',
            contactPerson: 'Deepak Sinha',
            mobile: '9876541230',
            email: 'deepak@sinhawealth.in',
            status: 'Moderate',
            empanelmentDate: '2020-03-15',
            lastContact: '2026-03-01',
            assignedRM: 'rm001',
            aum: { current: 3.1, previous: 3.0, lastYear: 2.4 },
            growth: { mom: 3.3, yoy: 29.2 },
            sips: { active: 54, amount: 1.1 },
            newFolios: { mtd: 2, ytd: 14 },
            transactions: { mtd: 21, ytd: 98 },
            schemes: [
                { name: 'Hybrid Balanced', aum: 1.4, pct: 45 },
                { name: 'Debt Short Term', aum: 1.0, pct: 32 },
                { name: 'Liquid', aum: 0.7, pct: 23 }
            ],
            callHistory: [
                { date: '2026-03-01', outcome: 'Neutral', notes: 'CP is cautious about equity exposure. Focused on debt products. To revisit next month with performance data.', nextFollowUp: '2026-03-15' }
            ]
        },
        {
            id: 'cp005',
            name: 'Nexgen Advisory',
            arn: 'ARN-201543',
            city: 'Mumbai',
            area: 'Malad West',
            contactPerson: 'Priyanka Joshi',
            mobile: '9812673450',
            email: 'priyanka@nexgenadvisory.com',
            status: 'Active',
            empanelmentDate: '2022-01-10',
            lastContact: '2026-03-07',
            assignedRM: 'rm001',
            aum: { current: 2.8, previous: 2.2, lastYear: 0.8 },
            growth: { mom: 27.3, yoy: 250.0 },
            sips: { active: 67, amount: 1.5 },
            newFolios: { mtd: 9, ytd: 38 },
            transactions: { mtd: 38, ytd: 156 },
            schemes: [
                { name: 'Equity Flexi Cap', aum: 1.2, pct: 43 },
                { name: 'ELSS', aum: 0.8, pct: 29 },
                { name: 'Equity Mid Cap', aum: 0.5, pct: 18 },
                { name: 'Liquid', aum: 0.3, pct: 10 }
            ],
            callHistory: [
                { date: '2026-03-07', outcome: 'Positive', notes: 'High-growth new CP. Excellent traction with young investor base. Pushing equity and ELSS heavily.', nextFollowUp: '2026-03-12' },
                { date: '2026-02-20', outcome: 'Positive', notes: 'CP achieved new SIP target. Celebrated success. Agreed to push NFO.', nextFollowUp: '2026-03-07' }
            ]
        },
        {
            id: 'cp006',
            name: 'Pioneer Financial Hub',
            arn: 'ARN-088712',
            city: 'Navi Mumbai',
            area: 'Vashi',
            contactPerson: 'Kiran Desai',
            mobile: '9823145600',
            email: 'kiran@pioneerfh.com',
            status: 'Inactive',
            empanelmentDate: '2017-06-25',
            lastContact: '2026-01-15',
            assignedRM: 'rm001',
            aum: { current: 1.4, previous: 1.6, lastYear: 2.2 },
            growth: { mom: -12.5, yoy: -36.4 },
            sips: { active: 18, amount: 0.4 },
            newFolios: { mtd: 0, ytd: 2 },
            transactions: { mtd: 5, ytd: 22 },
            schemes: [
                { name: 'Hybrid Balanced', aum: 0.8, pct: 57 },
                { name: 'Debt Long Term', aum: 0.6, pct: 43 }
            ],
            callHistory: [
                { date: '2026-01-15', outcome: 'Negative', notes: 'CP mentioned portfolio issues. Business declining. Needs re-engagement strategy. Escalate to Sr. RM.', nextFollowUp: '2026-03-10' }
            ]
        },
        {
            id: 'cp007',
            name: 'Accord Wealth Partners',
            arn: 'ARN-145023',
            city: 'Mumbai',
            area: 'Andheri West',
            contactPerson: 'Neeraj Agarwal',
            mobile: '9819023456',
            email: 'neeraj@accordwealth.in',
            status: 'Active',
            empanelmentDate: '2020-09-18',
            lastContact: '2026-03-09',
            assignedRM: 'rm001',
            aum: { current: 6.2, previous: 5.8, lastYear: 4.1 },
            growth: { mom: 6.9, yoy: 51.2 },
            sips: { active: 118, amount: 2.6 },
            newFolios: { mtd: 7, ytd: 34 },
            transactions: { mtd: 56, ytd: 264 },
            schemes: [
                { name: 'Equity Large Cap', aum: 2.5, pct: 40 },
                { name: 'Equity Mid Cap', aum: 1.9, pct: 31 },
                { name: 'ELSS', aum: 1.1, pct: 18 },
                { name: 'Hybrid', aum: 0.7, pct: 11 }
            ],
            callHistory: [
                { date: '2026-03-09', outcome: 'Positive', notes: 'Regular meeting. CP is planning a client investment camp next week. Will require marketing collateral.', nextFollowUp: '2026-03-16' }
            ]
        }
    ],

    // ── Today's Call Schedule ─────────────────────
    todayCalls: [
        { time: '10:00 AM', cp: 'Kapoor Investments', contactPerson: 'Ramesh Kapoor', purpose: 'NFO Follow-up', cpId: 'cp003' },
        { time: '12:00 PM', cp: 'Pioneer Financial Hub', contactPerson: 'Kiran Desai', purpose: 'Re-engagement', cpId: 'cp006' },
        { time: '03:00 PM', cp: 'Nexgen Advisory', contactPerson: 'Priyanka Joshi', purpose: 'Scheme Review', cpId: 'cp005' },
        { time: '05:00 PM', cp: 'Accord Wealth Partners', contactPerson: 'Neeraj Agarwal', purpose: 'Marketing Collateral', cpId: 'cp007' }
    ],

    // ── Reports (role-based) ───────────────────────
    reports: [
        {
            id: 'r1',
            title: 'Business Summary',
            icon: '📊',
            description: 'Overall AUM, SIP, and transaction summary',
            roles: ['RM', 'Senior RM', 'Area Manager'],
            data: {
                headers: ['Metric', 'MTD', 'Last Month', 'YTD'],
                rows: [
                    ['Total AUM (₹ Cr)', '42.6', '38.4', '42.6'],
                    ['Active SIPs', '709', '688', '709'],
                    ['New SIP Amount (₹ Cr)', '3.8', '3.2', '21.4'],
                    ['New Folios', '43', '38', '226'],
                    ['Transactions', '333', '298', '1,574'],
                    ['Lump Sum (₹ Cr)', '2.1', '1.8', '11.2']
                ]
            }
        },
        {
            id: 'r2',
            title: 'SIP Report',
            icon: '🔄',
            description: 'Active SIPs, new registrations, cancellations',
            roles: ['RM', 'Senior RM', 'Area Manager'],
            data: {
                headers: ['CP Name', 'Active SIPs', 'New SIPs', 'Cancelled', 'Net'],
                rows: [
                    ['Kapoor Investments', '210', '12', '3', '+9'],
                    ['Mahindra Wealth', '142', '8', '1', '+7'],
                    ['Accord Wealth', '118', '7', '2', '+5'],
                    ['Greenfield FS', '98', '5', '0', '+5'],
                    ['Nexgen Advisory', '67', '9', '1', '+8'],
                    ['Sinha Wealth', '54', '2', '1', '+1'],
                    ['Pioneer FH', '18', '0', '4', '-4']
                ]
            }
        },
        {
            id: 'r3',
            title: 'New Business',
            icon: '🆕',
            description: 'New folios, new clients, applications in process',
            roles: ['RM', 'Senior RM', 'Area Manager'],
            data: {
                headers: ['CP Name', 'New Folios', 'Lump Sum (₹ L)', 'Status'],
                rows: [
                    ['Kapoor Investments', '12', '8.4', 'Processed'],
                    ['Nexgen Advisory', '9', '3.2', 'Processed'],
                    ['Mahindra Wealth', '8', '5.6', 'Processed'],
                    ['Accord Wealth', '7', '4.1', 'In Review'],
                    ['Greenfield FS', '5', '2.8', 'Processed'],
                    ['Sinha Wealth', '2', '1.0', 'Pending'],
                    ['Pioneer FH', '0', '0', '—']
                ]
            }
        },
        {
            id: 'r4',
            title: 'Scheme Analysis',
            icon: '📈',
            description: 'AUM break-up by scheme category',
            roles: ['Senior RM', 'Area Manager'],
            data: {
                headers: ['Scheme Type', 'AUM (₹ Cr)', '% Share', 'MoM Growth'],
                rows: [
                    ['Equity – Large Cap', '16.4', '38.5%', '+8.2%'],
                    ['Equity – Mid Cap', '9.8', '23.0%', '+11.4%'],
                    ['Equity – Flexi Cap', '3.2', '7.5%', '+18.6%'],
                    ['ELSS', '5.1', '12.0%', '+9.1%'],
                    ['Hybrid', '4.6', '10.8%', '+5.2%'],
                    ['Debt', '2.9', '6.8%', '+1.4%'],
                    ['Liquid', '1.1', '2.6%', '-0.8%'],

                ]
            }
        },
        {
            id: 'r5',
            title: 'Top Performers',
            icon: '🏆',
            description: 'Top CPs by AUM, growth and new business',
            roles: ['Senior RM', 'Area Manager'],
            data: {
                headers: ['Rank', 'CP Name', 'AUM (₹ Cr)', 'MoM Growth'],
                rows: [
                    ['1', 'Kapoor Investments', '11.2', '+7.7%'],
                    ['2', 'Mahindra Wealth', '8.4', '+10.5%'],
                    ['3', 'Accord Wealth', '6.2', '+6.9%'],
                    ['4', 'Greenfield FS', '5.7', '+11.8%'],
                    ['5', 'Nexgen Advisory', '2.8', '+27.3%']
                ]
            }
        },
        {
            id: 'r6',
            title: 'AUM & Growth Tracker',
            icon: '📉',
            description: 'Month-wise AUM trend and growth tracking',
            roles: ['Senior RM', 'Area Manager'],
            data: {
                headers: ['Month', 'AUM (₹ Cr)', 'MoM Δ', 'YoY Δ'],
                rows: [
                    ['Mar 2026', '42.6', '+11.0%', '+44.6%'],
                    ['Feb 2026', '38.4', '+6.1%', '+38.2%'],
                    ['Jan 2026', '36.2', '+4.9%', '+32.1%'],
                    ['Dec 2025', '34.5', '+3.6%', '+28.4%'],
                    ['Nov 2025', '33.3', '+2.8%', '+25.6%'],
                    ['Oct 2025', '32.4', '+5.2%', '+21.8%']
                ]
            }
        }
    ],

    // ── Tasks & Reminders ────────────────────────
    tasks: [
        {
            id: 't1', cpId: 'cp003', cpName: 'Kapoor Investments',
            title: 'Share NFO brochure and discuss new SIP plan',
            type: 'Follow-up', priority: 'High',
            dueDate: '2026-03-10', dueTime: '3:00 PM',
            reminder: '30 mins before',
            status: 'Pending', notes: 'Ramesh mentioned interest in NFO. Send brochure and call.'
        },
        {
            id: 't2', cpId: 'cp006', cpName: 'Pioneer Financial Hub',
            title: 'Re-engagement call – discuss AUM decline strategy',
            type: 'Call', priority: 'High',
            dueDate: '2026-03-10', dueTime: '12:00 PM',
            reminder: '1 hour before',
            status: 'Pending', notes: 'AUM declining. Kiran needs special attention. Escalate if no response.'
        },
        {
            id: 't3', cpId: 'cp001', cpName: 'Mahindra Wealth Advisors',
            title: 'Send ELSS scheme comparison document',
            type: 'Document', priority: 'Medium',
            dueDate: '2026-03-11', dueTime: '11:00 AM',
            reminder: '1 day before',
            status: 'Pending', notes: 'Suresh asked for ELSS vs ULIP comparison. Prepare and share.'
        },
        {
            id: 't4', cpId: 'cp005', cpName: 'Nexgen Advisory',
            title: 'Monthly review meeting – Equity + ELSS performance',
            type: 'Meeting', priority: 'Medium',
            dueDate: '2026-03-12', dueTime: '3:00 PM',
            reminder: '2 hours before',
            status: 'Pending', notes: 'Priyanka wants a detailed review of equity scheme performance for clients.'
        },
        {
            id: 't5', cpId: 'cp007', cpName: 'Accord Wealth Partners',
            title: 'Arrange marketing collateral for client camp',
            type: 'Task', priority: 'High',
            dueDate: '2026-03-13', dueTime: '10:00 AM',
            reminder: '1 day before',
            status: 'Pending', notes: 'Neeraj is organising a client camp. Need banners, brochures, and scheme cards.'
        },
        {
            id: 't6', cpId: 'cp002', cpName: 'Greenfield Financial Services',
            title: 'Share Flexi Cap vs Mid Cap scheme comparison',
            type: 'Document', priority: 'Low',
            dueDate: '2026-03-12', dueTime: '2:00 PM',
            reminder: '1 day before',
            status: 'Pending', notes: 'Anita requested scheme comparison document.'
        },
        {
            id: 't7', cpId: 'cp001', cpName: 'Mahindra Wealth Advisors',
            title: 'Follow up on March SIP targets',
            type: 'Follow-up', priority: 'Medium',
            dueDate: '2026-03-08', dueTime: '10:00 AM',
            reminder: '30 mins before',
            status: 'Completed', notes: 'Completed. SIP targets discussed and agreed.'
        },
        {
            id: 't8', cpId: 'cp004', cpName: 'Sinha Wealth Management',
            title: 'Review debt product options for conservative clients',
            type: 'Review', priority: 'Low',
            dueDate: '2026-03-09', dueTime: '4:00 PM',
            reminder: '1 hour before',
            status: 'Completed', notes: 'Shared debt fund options. Deepak will consider Short Duration fund.'
        }
    ],

    // ── Notifications ─────────────────────────────
    notifications: [
        { id: 'n1', type: 'alert', icon: '⚠️', title: 'Pending Follow-up', body: 'Pioneer Financial Hub – Re-engagement due today', time: '9:00 AM', read: false },
        { id: 'n2', type: 'success', icon: '✅', title: 'Application Processed', body: 'Kapoor Investments – 12 new folio applications approved', time: 'Yesterday', read: false },
        { id: 'n3', type: 'info', icon: '📋', title: 'Report Available', body: 'February Business Summary report is now available', time: 'Yesterday', read: true },
        { id: 'n4', type: 'alert', icon: '🔔', title: 'SIP Cancellation Alert', body: 'Pioneer Financial Hub – 4 SIP cancellations this month', time: '2 days ago', read: true },
        { id: 'n5', type: 'success', icon: '🎯', title: 'Target Achieved', body: 'Nexgen Advisory has met its monthly SIP target', time: '3 days ago', read: true },
        { id: 'n6', type: 'info', icon: '📣', title: 'NFO Launch', body: 'New NFO – Prudent Emerging Opportunities Fund opens March 15', time: '4 days ago', read: true }
    ]
};
