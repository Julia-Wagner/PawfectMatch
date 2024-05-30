# **Testing**

[Go back to the README](README.md)

## **Table of Contents**

<!-- TOC -->
* [**Testing**](#testing)
  * [**Table of Contents**](#table-of-contents)
  * [**Manual Testing**](#manual-testing)
    * [**iPhone Testing**](#iphone-testing)
<!-- TOC -->

## **Manual Testing**

I started this project by setting everything up and deploying it right away. While developing new features, I tested them on the local version. After finishing and pushing features or parts of them, I tested them on the deployed project.

I always tested new input by entering incorrect information and trying to break it. This way I ensured correct error handling and feedback to the user.

I regularly tested the application in different browsers and devices, like my phone and tablet. When I found a bug while testing on my phone, I created a **Bug Issue** on my Kanban board and provided details and screenshots. After finishing all my *must have* user stories for the MVP, I did a first big round of testing.

The *#peer-code-review* channel on Code Institute´s Slack was used to get some feedback from other students. I also sent the link to my project to friends and family asking them to test it.

I tested to a minimum screen width of **300px** and a maximum screen width of **3440px** with my monitor. To test **Safari** and **iOS devices** I used [BrowserStack](https://www.browserstack.com/).

### **iPhone Testing**

While testing on BrowserStack, I noticed that cookies are not set on some iPhones and also when using an incognito browser. I spent some time reviewing the issue and then used tutor support. 

There I got the information, that this is a known issue and can be solved by allowing *third-party cookies* in the browser settings. The issue is described [here](https://code-institute-room.slack.com/archives/C02MTH5MBDG/p1659719243446449?thread_ts=1659705919.570999&cid=C02MTH5MBDG). As it is a known issue described by Code Institute, I decided to mark the bug as resolved for me. And continue testing with the needed browser settings.

![BrowserStack iPhone](docs/testing/iphone_safari.png)\
*BrowserStack testing iPhone*

![BrowserStack iPad](docs/testing/ipad_safari.png)\
*BrowserStack testing iPad*
