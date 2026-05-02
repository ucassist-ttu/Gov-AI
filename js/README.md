# JavaScript Files Documentation

## Introduction

This document provides a simple explanation of all the JavaScript files in the `js` folder of the Gov-AI project. These files are responsible for making the website interactive and handling various features like searching for services, displaying maps, managing forms, and tracking user activity. The explanations are written in plain English to be understandable for both technical (IT) and non-technical people.

The Gov-AI website helps people find government and community services using AI-powered search. The JavaScript files work together to create a smooth user experience, from the homepage to detailed service pages.

## Table of Contents

- [ai_results.js](#ai_resultsjs)
- [analytics.js](#analyticsjs)
- [api.js](#apijs)
- [editService.js](#editservicejs)
- [emailEditServiceReview.js](#emaileditservicereviewjs)
- [emailNewServiceReview.js](#emailnewservicereviewjs)
- [emailReferralFormReview.js](#emailreferralformreviewjs)
- [index.js](#indexjs)
- [indexCarousel.js](#indexcarouseljs)
- [iNeed.js](#ineedjs)
- [info.js](#infojs)
- [navbar.js](#navbarjs)
- [org_profilepage.js](#org_profilepagejs)
- [pinmap.js](#pinmapjs)
- [referral_form.js](#referral_formjs)
- [registration_form.js](#registration_formjs)
- [service.js](#servicejs)
- [services.js](#servicesjs)

## File Descriptions

### Core Search & Results

#### ai_results.js
This file displays the results from an AI-powered search. When a user enters a need (like "food assistance"), it shows up to 3 recommended services with details like name, description, contact info, and location. It also handles printing the results and tracks search analytics.

**Detailed Explanation**: 
- Retrieves the search prompt from session storage
- Calls the backend API to get up to 3 recommended services
- Renders service cards with name, organization, description, phone, email, and location
- Links phone numbers and addresses to Google Maps
- Tracks search analytics for future improvements
- Includes a print button to download results as a PDF; shows fallback message if no services match the search

#### index.js
Manages the main homepage. It handles the AI search button, validates user input, and redirects to the results page. It also shows alerts if something is missing.

**Detailed Explanation**:
- Listens for clicks on the "AI Search" button
- Validates that users enter a search prompt (shows an error if empty)
- Stores the user's search query in session storage
- Redirects users to the results page for processing
- Creates the entry point for the entire AI search workflow

---

### Navigation & Location

#### navbar.js
Controls the navigation bar at the top of the site. It lets users select their county and updates the display accordingly. It also handles menu interactions.

**Detailed Explanation**:
- Auto-detects user's county using geolocation (latitude/longitude)
- Displays the selected county in the navbar
- Allows manual county selection via a dropdown menu
- Stores the county selection in session storage for use across pages
- Uses BigDataCloud API for reverse geocoding; defaults to "Select a County" if location unavailable

#### indexCarousel.js
Creates a popup tutorial that explains how to use the AI search feature. It guides new users through the process with images or steps.

**Detailed Explanation**:
- Shows a step-by-step guide explaining how to use the AI search feature (with numbered steps and examples)
- Appears when users click "Learn Search Bar" button
- Helps new users understand the search process without leaving the page

---

### Service Browsing & Discovery

#### iNeed.js
Categorizes services into types like food, housing, or health. It also detects the user's location (county) to show relevant services nearby.

**Detailed Explanation**:
- Creates clickable category pills/buttons
- Filters services by selected category
- Displays service descriptions for each category
- Supports horizontal scrolling through categories
- Links shorthand keywords (like "Crisis") to full database categories (like "Abuse and Crisis Intervention")

#### services.js
Lists all available services with options to filter by category, location, or search terms. Users can browse and find services that match their needs.

**Detailed Explanation**:
- Fetches all available services from the database
- Creates filters for county, service type, and organization name
- Allows multi-filter combinations (e.g., "Food services in Putnam County")
- Displays service logos from the database or placeholder images
- Tracks which filters users interact with for analytics

#### service.js
Shows detailed information about a single service, including full description, contact info, address, and how to access it.

**Detailed Explanation**:
- Displays service name and organization logo
- Shows full description and eligibility criteria
- Provides contact phone and email (with clickable links)
- Includes physical address (linked to Google Maps)
- Lists website URL, operating hours, tags/categories, and available counties
- Includes a print/download button for converting service details to PDF

---

### Data Visualization

#### info.js
Creates charts and graphs to show statistics about services, such as how many services are in each category or county. This helps with data visualization.

**Detailed Explanation**:
- Tracks which services get viewed most frequently (by month)
- Creates bar charts showing service views by category
- Creates county-based views (which counties access which services)
- Color-codes each service type for visual consistency
- Allows filtering charts by county
- Fetches "monthly-views" data from the API

#### pinmap.js
Generates an interactive map with pins showing where services are located. Pins are colored by service category, and users can click for more details.

**Detailed Explanation**:
- Uses Leaflet.js library for mapping
- Places colored pins for each service type (Food = pink, Housing = brown, Health = red, etc.)
- Shows county boundaries with labels
- Organizes services into a MapItem class for easy data structure
- Defines coordinates for all 14 Upper Cumberland counties

---

### Organization & Admin Features

#### org_profilepage.js
Displays an organization's profile page, showing their information and all the services they offer. Users can browse what each organization provides.

**Detailed Explanation**:
- Shows organization information (name, description, contact details)
- Lists all services offered by that organization
- Provides links to view/edit individual services

#### editService.js
Allows organizations to update information about their services, such as changing descriptions, contact details, or locations. It ensures changes are saved properly.

**Detailed Explanation**:
- Manages a multi-step form for editing service details (name, description, phone, address, hours, etc.)
- Handles organization contact information (primary and secondary contacts)
- Implements tab-based navigation between multiple services
- Stores form data in variables before submission
- Includes a progress indicator showing which step the user is on

#### registration_form.js
A multi-step form for organizations to sign up and add new services. It guides them through entering details step by step.

**Detailed Explanation**:
- Handles a multi-step registration wizard (3+ steps)
- Step 1: Organization information (name, description, address, contact)
- Step 2: Primary and secondary contact person details
- Step 3: Service details (multiple services can be added via tabs)
- Collects hours of operation for each service
- Generates time range options for business hours
- Uses EmailJS to send confirmation emails
- Includes progress tracking, tab management for multiple services, and form validation

---

### Referral System

#### referral_form.js
Handles the form where users can refer someone else to a service. It collects the information and sends it to the database for processing.

**Detailed Explanation**:
- Collects first name, last name, email, and message from the referrer
- Validates all required fields
- Sends referral data to database
- Uses EmailJS to send notification emails
- Shows success/error alerts using SweetAlert

#### emailReferralFormReview.js
Prepares and shows the details of a referral form for email notifications. This is used when someone refers another person to a service.

**Detailed Explanation**:
- Fetches referral details from the database by ID
- Populates form fields with referral information (name, email, message)
- Used in email notifications or admin review pages

---

### Edit Service Reviews

#### emailEditServiceReview.js
Shows a preview of changes made to a service before they are approved. This helps organizations review edits before submitting them for final approval.

**Detailed Explanation**:
- Fetches current service data and pending edit requests from API
- Populates form with original information on the left
- Populates form with proposed changes on the right
- Shows all editable fields: name, description, address, phone, hours, etc.
- Includes button to approve changes to database
- Shows organization and contact person information

#### emailNewServiceReview.js
Displays a preview of a new service being added by an organization. It lets them check all the details before the service is officially registered.

**Detailed Explanation**:
- Fetches pending new service and organization data via UUID
- Displays all organization details (company name, contact info, etc.)
- Shows all service details (name, description, location, hours, etc.)
- Includes button to add service to database permanently

---

### Backend Communication

#### api.js
A helper file that makes it easy for other parts of the website to send requests to the server. It handles things like fetching data or sending form submissions securely.

**Detailed Explanation**:
- Central helper for all backend API calls
- Key function: `fetchApi()` - wraps the native fetch API with consistent URL building
- Builds complete URLs to the backend server
- Handles headers and request methods consistently
- Used by every other JavaScript file to communicate with the database
- Example: `fetchApi('/prompt', {method: 'POST', body: JSON.stringify({user_input})})` sends search queries to the AI

---

### Analytics & User Tracking

#### analytics.js
Tracks how users use the website, such as which pages they visit, how long they stay, and what they click on. This helps improve the site by understanding user behavior.

**Detailed Explanation**:
- Monitors how users interact with the website
- Tracks page views, time on page, scroll depth, click history, rage clicks, session duration, and session timeout
- Stores session data in browser's localStorage
- Resets session tracking after 30 minutes of inactivity
- Invisible to users; helps Gov-AI team improve the site based on behavior patterns

---

## How Files Work Together

1. **User Journey**: `index.js` → `ai_results.js` → `service.js` or browse via `services.js`/`iNeed.js`
2. **Location**: `navbar.js` runs on every page to track user's county
3. **Analytics**: `analytics.js` tracks events on every page automatically
4. **Data Flow**: All files use `api.js` to communicate with backend; `pinmap.js` and `info.js` visualize that data
5. **Admin Operations**: `registration_form.js` → `emailNewServiceReview.js` → database; `editService.js` → `emailEditServiceReview.js` → database

Each file is specialized but interconnected, creating a complete system for finding and managing community services.</content>
<parameter name="filePath">c:\Users\Ashle\Documents\swe ai&gov\Gov-AI\js\README.md