# Welcome to HANS!
<img src="public/hans_dalle.jpg" alt="Hans Hero Image" width="200">

## About

[HANS](https://hans.steffen-ermisch.de) is a web app making AI-powered transcription made easy.
It uses the power of OpenAIs machine learning model for speech recognition and transcription, called Whisper. Whisper delivers a high accuracy compared to many other services. However OpenAI does not offer a consumer friendly UI, but only an API.

HANS fills this gap, giving users a convient way to upload their audio (or video) files. The transcriptions (as welll as the audio files)
are stored in the cloud and can be accessed from anywhere.

## Live Demo
[https://hans.steffen-ermisch.de](https://hans.steffen-ermisch.de)

## Technologies

- Framework: [Next.js](https://nextjs.org/)
- Language: Typescript
- CSS/Styling: [Tailwind](https://tailwindcss.com)
- Database: [Supabase](https://supabase.com/)
- Authentication: [Supabase](https://supabase.com/)
- Text editor: [TipTap](https://tiptap.dev/)
- Deployment: Docker
- Audio / Video transformation: [FFmpeg](https://ffmpeg.org/) and [ffmpeg.wasm](https://ffmpegwasm.netlify.app/)

## Structure

As HANS is a Next.js-project it has a Next.js-specific structure. Below folders and files are listed specific to this webapp.

### Main folder

Important settings:

- **env.example**: Contains main settings like address to the supabase backend (can be self hosted or managed)
- **Dockerfile** / **compose.yaml**: needed if the app runs in a docker container

### public folder

Contains images.

### src folder

- **middleware.ts**: This file makes sure that only authenticated user can access certain routes

#### app folder

The web-app uses the app router in Next.js. The file "page.tsx" represents the home page. "layout.tsx" loads the layout, metadata and app-wide scripts (analytics tool, for example).

Each folder represents a route (single page or a set of pages):

- **(auth)**: contains pages related to user authentication: signup, login, forgot-password, confirm-signup
- **account**: equivalent to a "settings" page on which users can change their usernames, passwords, email-adresses etc.
- **imprint**: page with address of website owner and a contact form (enabled by nodemailer)
- **legal**: privacy policy, both in English and German to meet regulatory requirements
- **projects**: user dashboard - lists all projects a user created and a link to the upload page
- **projects/[projectid]**: subpage for a specific project, displays the audio file and the transcript, which can be edited
- **support**: contains frequently asked questions
- **upload**: page to initiate a new project, core is a dropzone for file upload. Within the upload folder is a "\_components" subfolder with a "\_server" subfolder. The files there represent server actions used to convert video files into audio files and split large audio files before making an API request to OpenAI, where the speech-to-text-transformation happens.

#### components folder

This folder contains reusable React components:

- **forms** folder: contains form element used in different forms (mainly account related)
- **navbar** folder: responsive navbar with an "AuthButton" for sign in / sign out
- **ui** folder: contains UI-components, for example modals and custom alerts

#### lib folder

This folder contains all supabase-related configuration files and typescript types.

#### utils folder

Helper used in differnt places of the app:

- **getTime**: transforms Date Object to timestamp "YY:MM:DD at HH:MM"
- **getErrorMessage**: extracts error message from API requests

## Challenges during developement

### Database

To handle authentication and store date I first planned to use [Firebase](https://firebase.google.com/), a wep app development platform by Google. Then I noticed that Firebase is not fully compliant with GDPR. That is why I switched to Supabase which claims to be "an open source Firebase alternative". Supabase offers a managed service as well as a self-hosting option. I opted for self-hosting, which was challenging as I had no prior experience with a Virtual Private Server (VPS) or docker. A helpful tutorial was found in a [blog article of David Lorenz](https://blog.activeno.de/the-ultimate-supabase-self-hosting-guide).

### Backend

My first attempt was to build the frontend with React while I used [Express](https://expressjs.com/) for API calls to OpenAI. While this approach worked I wanted to improve security and handle all requests to Supbase server-sides. This requirement lead to to Next.js. This framework supports server and client components as well as "server actions".

### Audio transformation

By default the API of OpenAI limits file uploads for it's speech recognition and transcription model "Whisper" to audio files of specific formats and a maxiumum size of 25 MB. As I wanted to let users upload larger audio files and video files as well I needed to extract the audio from video files and split large audio files into smaller chunks, running API calls for each chunk and combining them afterwards. The conversion from video to audio binds a lot of ressources, so I choose to handle this process on device with a web-based version of ffmpeg (more specifically ffmpeg.wasm). If the audio file submitted to the server is larger than 25 MB it is splitted on the server by spawing a ffmpgeg process. Challenging at first was to do that in a non-blocking-way, also memory usage on the server needed to be handled.

## Limitations

Security concerns as well as well as accounting-related challenges holded me back to make HANS commercial. For example I would need to:

- run more security checks
- implement a payment solution
- implement an invoice system

I also would either use a self-hosted version of Whisper (which is possible as OpenAI open-sourced the model) or a managed service by Microsoft hosted in a European data center.

Another concern is perfomance. While the app worked perfectly fine in my tests, I have not simulated an excessive usage. Probably a stronger VPS would be needed as well as some form of load balancing.
