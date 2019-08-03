## Table of Contents
1. [Overview](#Overview)
1. [Product Spec](#Product-Spec)
1. [Wireframes and Data Schema Design](#Wireframes-and-Data-Schema-Design)
1. [Digital Wireframes and Mockups](#Digital-Wireframes-and-Mockups)

## Overview

### Description
A React-Native app facilitates real-time location tracking of physicians (as well as patients) in an radiation oncology clinic to improve patient visit experience. It will help track the time that patients have spent at each treament stage; the collection timestamps would be analyzed to see rooms of improvements of patient service. 

### Getting Started
1. Open the terminal, go to the directory where you would like to store this project.
2. Type `git clone https://github.com/team-dante/dante-patient-master-branch.git`
3. Navigate to project folder (`cd dante-patient-master-branch`)
4. Make sure your computer has the newest version of Java JDK and Node.js
	* For Windows users, have Android Studio and Android Emulator ready.
	* For Mac users, have Xcode installed.
5. Type `npm install`.
6. Run the project with 
	* `react-native run-ios`, or `npm run ios` for Mac users
	* `react-native run-android` for Windows users

## Product Spec
### 1. User Stories (Required and Optional)

**Required Must-have Stories**

* Patients can see where doctors are located inside the radiation oncology
* Patients can check-in / check-out when they enter/leave a room 
* Patients can provide feedback about their experience during the visit.
* Clinic staff can view feedback and visit duration for each patient.

**Optional Nice-to-have Stories**

* Display collected data in visual-appealing graphs
* Patients can see the clock is ticking when they go inside a room.
* The hospital staff can minimize the amount of external help they need to provide for patients.
* Paitents click as few buttons as possible.

### 2. Screen Archetypes
* Login
	* Allows patients to use their own phone numbers and PINs assigned by the oncology clinic staff. 
* Activate Account / Sign Up
	* For first-time patients, they need to enter their phone numbers to activate their accounts (assigned by staff beforehand). 
* Oncology Clinic Map Screen
	* Allows a patient to see the number of other patients ahead of him/her.
	* Allows a paitent to track doctors' location inside the oncology clinic in real-time.
* Visits History Screen
	* Allows patients to see the overall duration of a visit, the time spent at each treatment rooms, and the transition time.
* Profile Screen
	* Allows patients to fill a survey if they wish
	* Allows patients to logs out
* QR Scanner Screen
	* Allows patients to scan QR code to sign-in/sign-out of a room.

### 3. Navigation

**Tab Navigation** (Tab to Screen)

* Oncology Map
* Visits History
* Profile

**Header Navigation**:
* Scan QR

**Flow Navigation** (Screen to Screen)
* Log in successfully -> go to map
* Activate accounts successfully -> go to map
* Profile -> survey page
* Profile -> Log out and back to sign in screen
* Scan QR at the top right -> if successful -> Notice page telling patients have checked-in successfully or checked-out successfully

## Wireframes and Data Schema Design

**Authentication**
<p float="left">
<img src="https://i.imgur.com/f8DcUbw.png" width="250"/>
<img src="https://i.imgur.com/t0Qzekj.png" width="250"/>
</p>
<br>

**App Flow Proposal**
<p float="left">
<img src="https://i.imgur.com/25I7zow.png" width="250"/>
<img src="https://i.imgur.com/3gSF1u4.png" width="250"/>
</p>

*<Wireframes & Data Schema Design>*

---

### Digital Wireframes and Mockups
<p float="left">
<img src="https://i.imgur.com/Gu9YS8D.png" width="250"/>
<img src="https://i.imgur.com/UWDtpq1.png" width="250"/>
<img src="https://i.imgur.com/di0irQl.png" width="250"/>
</p>
<p float="left">
<img src="https://i.imgur.com/xINQ7aL.png" width="250"/>
<img src="https://i.imgur.com/ZbcgvpR.png" width="250"/>
<img src="https://i.imgur.com/J8YlQnX.png" width="250"/>
</p>
<p float="left">
<img src="https://i.imgur.com/zHZrFYe.png" width="250"/>
<img src="https://i.imgur.com/iRrdNOq.png" width="250"/>
<img src="https://i.imgur.com/5InzeqA.png" width="250"/>
</p>
<p float="left">
<img src="https://i.imgur.com/WbvbeNQ.png" width="250"/>
<img src="https://i.imgur.com/AgNJmZ6.png" width="250"/>
<img src="https://i.imgur.com/ULCDs8T.png" width="250"/>
</p>
Enhanced Map and Visit History
<p float="left">
<img src="https://i.imgur.com/oaLmRPY.png" width="250"/>
<img src="https://i.imgur.com/efeNVng.jpg" width="250"/>
</p>

## Contributors

- [Hung Phan](https://github.com/hp0101)
- [Xinhao Liang](https://github.com/xinhao128)

## Lisense

	Copyright 2019 Hung Phan and Xinhao Liang

	Redistribution and use in source and binary forms, with or 
	without modification, are permitted provided that the following 
	conditions are met:

	1. Redistributions of source code must retain the above copyright 
	notice, this list of conditions and the following disclaimer.

	2. Redistributions in binary form must reproduce the above copyright 
	notice, this list of conditions and the following disclaimer in the 
	documentation and/or other materials provided with the distribution.

	3. Neither the name of the copyright holder nor the names of its 
	contributors may be used to endorse or promote products derived from 
	this software without specific prior written permission.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
	"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
	LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR 
	A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT 
	HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
	SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED 
	TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR 
	PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
	LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING 
	NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS 
	SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.