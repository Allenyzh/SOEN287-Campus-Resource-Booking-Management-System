# Campus Resource Booking & Management System - TODO List

**Course**: SOEN 287: Web Programming  
**Institution**: Concordia University - Gina Cody School of Engineering and Computer Science  
**Term**: Fall 2025  
**Team Size**: 4 students per team

---

## 📋 Project Overview

Design and develop a web-based system to manage the booking of university resources (study rooms, labs, sports facilities, specialized equipment, software seats). The system caters to both end users (students/faculty) and administrators (resource managers).

---

## 🎯 Deliverables Timeline

### Deliverable 1 - Frontend (Due: Sunday, October 26, 2025)
**Focus**: What users can see and do (may include hard-coded data)

**Marking Rubric**:
- Completeness: 5 marks
- Look and feel(style): 5 marks
- Navigation between pages: 5 marks
- **Total**: 15 marks

### Deliverable 2 - Backend (Due: Sunday, November 23, 2025)
**Focus**: Data storage and processing behind web server

**Marking Rubric**:
- Completeness: 3 marks
- Look and feel(style): 1 mark
- Navigation between pages: 1 mark
- Data store: 10 marks
- **Total**: 15 marks

**Note**: No hard-coded data in Deliverable 2; might need to revisit Deliverable 1 features

---

## ✅ Required Features

### 👥 End User Features (Students/Faculty)

- [ ] **User Account Management**
  - [ ] Create account (profile info, contact email, etc.)
  - [ ] Edit profile information
  - [ ] Delete account
  - [ ] Login/Logout functionality
  - [ ] Password management

- [ ] **Resource Browsing**
  - [ ] Browse list of available resources
    - [ ] Study rooms
    - [ ] Labs
    - [ ] Equipment
    - [ ] Other resources
  - [ ] Filter resources by type
  - [ ] Search functionality
  - [ ] Resource detail pages

- [ ] **Availability & Scheduling**
  - [ ] View real-time availability calendars/schedules
  - [ ] Check resource capacity
  - [ ] See blocked dates/times
  - [ ] View booking conflicts

- [ ] **Booking Management**
  - [ ] Make a booking/reservation
    - [ ] Select date
    - [ ] Select time
    - [ ] Specify purpose
    - [ ] Additional booking details
  - [ ] Modify existing bookings
  - [ ] Cancel bookings
  - [ ] View all bookings in one place
    - [ ] Past bookings
    - [ ] Upcoming bookings
  - [ ] Booking confirmation

- [ ] **Conflict Handling**
  - [ ] Prevent double-booking
  - [ ] Show conflict warnings
  - [ ] Suggest alternative times

### 🔧 Administrator Features (Resource Managers)

- [ ] **Resource Management**
  - [ ] Create new resources
    - [ ] Add names
    - [ ] Add descriptions
    - [ ] Set locations
    - [ ] Set capacities
    - [ ] Upload images
  - [ ] Edit existing resources
  - [ ] Remove resources
  - [ ] Categorize resources

- [ ] **Availability Management**
  - [ ] Set availability schedules
    - [ ] Working hours
    - [ ] Exceptions
    - [ ] Blackout dates
  - [ ] Manage resource calendars

- [ ] **Booking Administration**
  - [ ] Approve booking requests (if necessary)
  - [ ] Reject booking requests with reasons
  - [ ] Override bookings

- [ ] **Maintenance & Status**
  - [ ] Block resources temporarily
  - [ ] Unblock resources
  - [ ] Set maintenance periods
  - [ ] Update resource status

- [ ] **Analytics & Reporting**
  - [ ] View statistics about resource usage
  - [ ] Identify popular resources
  - [ ] Track peak usage times
  - [ ] Generate usage reports

---

## 🎁 Bonus Features

- [ ] **User Notifications**
  - [ ] Email notifications for booking confirmations
  - [ ] In-app notifications
  - [ ] Notifications for booking changes
  - [ ] Reminder notifications

- [ ] **Administrator Announcements**
  - [ ] Send announcements to users
  - [ ] Notify about maintenance downtime
  - [ ] System-wide notifications

---

## 🛠 Technical Requirements

### General Requirements
- [ ] **Web-based system**
  - [ ] Responsive design
  - [ ] Accessible from modern browsers
  - [ ] Mobile-friendly interface

- [ ] **Authentication & Authorization**
  - [ ] User authentication system
  - [ ] Role-based access (User/Admin)
  - [ ] Secure login/logout
  - [ ] Session management

- [ ] **Data Persistence**
  - [ ] Implement data storage
  - [ ] No hard-coded data in final version
  - [ ] Database integration

- [ ] **Conflict Management**
  - [ ] Handle booking conflicts gracefully
  - [ ] Prevent double-booking
  - [ ] Real-time availability updates

- [ ] **Modular Design**
  - [ ] Modular architecture for future additions
  - [ ] Support for payment integration (future)
  - [ ] Support for campus card integration (future)

- [ ] **Backend**
  - [ ] Node.js based backend
  - [ ] RESTful API design
  - [ ] Error handling

- [ ] **Libraries & Frameworks**
  - [ ] Choose and integrate appropriate libraries
  - [ ] Current tech stack: Next.js, React, TypeScript
  - [ ] UI components: Radix UI, Tailwind CSS

---

## 📦 Submission Requirements

### For Each Deliverable:
- [ ] **Feature Lists**
  - [ ] List of implemented features
  - [ ] List of features to be implemented next

- [ ] **Team Documentation**
  - [ ] Completed and signed "Teamwork Discussion" sheet
  - [ ] Individual contributions documented
  - [ ] Each member checks progress 2-3 times/week

- [ ] **Code & Files**
  - [ ] Compressed file with all website files
  - [ ] Clean, organized code structure
  - [ ] Comments in code

- [ ] **Documentation**
  - [ ] Installation guide (deployment instructions)
  - [ ] User guide (how to use website)
  - [ ] README file

- [ ] **Demo Preparation**
  - [ ] Schedule demo slot on Moodle
  - [ ] Demo via Zoom (online)
  - [ ] Prepare presentation

- [ ] **Submission**
  - [ ] Submit before 11:59pm on due date
  - [ ] Submit through Moodle only
  - [ ] One team member submits
  - [ ] All members endorse submission

---

## 📊 Current Progress

### ✅ Completed
- [x] Project structure setup
- [x] Next.js configuration
- [x] Basic routing structure
- [x] UI component library integration
- [x] Create account page
- [x] Sign-in page
- [x] Homepage layout
- [x] Navigation component
- [x] Theme system (dark/light mode)
- [x] Browse resources page structure
- [x] My bookings page with data table

### 🚧 In Progress
- [ ] Authentication implementation
- [ ] Resource detail pages
- [ ] Booking functionality
- [ ] Admin dashboard

### 📝 Not Started
- [ ] Backend API
- [ ] Database setup
- [ ] User profile management
- [ ] Resource CRUD operations
- [ ] Booking conflict handling
- [ ] Admin analytics
- [ ] Notification system

---

## ⚠️ Important Notes

1. **Team Collaboration**
   - Team consists of 4 students (THIS IS VERY IMPORTANT)
   - Regular check-ins required (2-3 times per week)
   - Professional reporting of contributions required
   - No covering for non-contributing members

2. **Academic Integrity**
   - Must provide appropriate citations if reusing material
   - Original work required

3. **Submission Rules**
   - Submit through Moodle ONLY
   - Email submissions NOT accepted
   - Submit ahead of deadline (don't wait until last minute)
   - Only ONE team member submits
   - All members must endorse submission

4. **Grading**
   - Individual marks based on contribution
   - Team mark for overall product quality
   - Demo performance affects grades
   - Poor team product = all members lose marks

---

## 🔍 Next Steps (Immediate)

1. [ ] Review and assign tasks among team members
2. [ ] Set up development environment for all team members
3. [ ] Create mockups/wireframes for all pages
4. [ ] Implement remaining user authentication pages
5. [ ] Design database schema
6. [ ] Start building resource browsing functionality
7. [ ] Set up team communication channels
8. [ ] Schedule regular team meetings
9. [ ] Begin working on Deliverable 1 features

---

## 📞 Team Information

**Team Members**: [To be filled]
1. Name: __________ | Email: __________ | Role: __________
2. Name: __________ | Email: __________ | Role: __________
3. Name: __________ | Email: __________ | Role: __________
4. Name: __________ | Email: __________ | Role: __________

**Team Communication**: [To be decided]
- Meeting schedule: __________
- Communication platform: __________
- Version control: GitHub

---

*Last Updated: October 14, 2025*
