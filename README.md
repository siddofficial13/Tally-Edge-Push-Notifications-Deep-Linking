# Tally-Edge Push Notifications and Deep Linking Framework

## Objective

To create a push notifications framework that can send notifications to client machines, whether they are mobile devices, desktops, or browsers.

## Problem Statement

Currently, TallyEdge relies solely on SMS for notification delivery. Push notifications can be implemented along with SMS to deliver low-priority notifications. Deep links can be embedded in these messages to allow the app to be opened directly from the message itself.

## Proposed Solution

Introduce a push notification and deep link handler in the TallyEdge backend and frontend that can push notifications to browsers and mobile devices.

## Technology Stack

- *React*: Frontend framework for building user interfaces
- *React Native*: Framework for building native mobile apps
- *Node.js*: JavaScript runtime for server-side development
- *Express*: Web application framework for Node.js
- *Deep Links*: URLs that link directly to specific content within an app
- *Design Thinking*: Approach for user-centric problem solving and solution design
- *Firebase*: Platform for building web and mobile applications, used for push notifications
- *AWS Services*: Cloud services platform
- *SNS*: Amazon Simple Notification Service for managing and delivering messages
