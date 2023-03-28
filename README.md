![supashim](assets/supashim-banner.webp)

Package Firebase apps for self-hosting by using
[Supabase](https://supabase.com/) as a drop-in replacement for
[Firebase](https://firebase.google.com/).

## ⚠️ Warning: Under Active Development!

This repo is under active development.
It is not ready to be used (definitely not in production,
and probably not even in testing).

We'd love help, feedback, and contributions. Please use
[GitHub Discussions](https://github.com/roboflow/supashim/discussions)
to get involved.

## Background

At [Roboflow](https://roboflow.com) we are heavy users of Firebase. But
we are working on [on-prem deployment](https://blog.roboflow.com/on-prem)
for our customers and there is no self-hosted version of Firebase.

This is where [Supabase](https://supabase.com/) and `supashim` come in.
Supabase is an open-source Firebase alternative that shares many of
the features of Firebase and is able to be [self-hosted](https://supabase.com/docs/guides/self-hosting)
using [Docker Compose](https://supabase.com/docs/guides/self-hosting/docker)
or [Kubernetes](https://github.com/supabase-community/supabase-kubernetes).

Supashim is a shim that hooks into the Firebase calls from your app and
translates them into the Supabase equivalents. This means you will be
able to take an existing Firebase app and simply swap out the `firebase`
global for `supashim` to package a self-hosted version of your Firebase
app (or to migrate to a Supabase backend) without having to change any
application code.

## Currently In Progress

### Firestore

The shim for `firestore` is in development on the `prototype/firestore`
branch. Currently, it is working to connect to Supabase, read/write data,
recommend and create Postgres indexes (via RPC).

Firestore features currently in active development are:

-   Support for realtime queries (this is mocked
    by polling the query for now)
-   Translating Firestore Security Rules into Supabase/Postgres Row Level Security.

## Roadmap

We plan to work on shimming the following features next (in this order):

-   `storage` [Firebase Cloud Storage](https://firebase.google.com/products/storage)
-   `auth` [Firebase Authentication](https://firebase.google.com/products/auth)

## Not Currently Planned

We don't need the following Firebase features for our use-case so
do not plan to build them ourselves (and there may not be
clear Supabase equivalents) but we would love to have them added
to the project by an external contributor if possible:

-   `analytics` [Firebase Analytics](https://firebase.google.com/products/analytics)
-   `app-check` [Firebase App Check](https://firebase.google.com/products/app-check)
-   `database` [Firebase Realtime Database](https://firebase.google.com/products/realtime-database)
-   `functions` [Firebase Functions](https://firebase.google.com/products/functions)
-   `messaging` [Firebase Cloud Messaging](https://firebase.google.com/products/cloud-messaging)
-   `performance` [Firebase Performance Monitoring](https://firebase.google.com/products/performance)
-   `remote-config` [Firebase Remote Config](https://firebase.google.com/products/remote-config)
-   Other features not included in the JS API like
    [Firebase Hosting](https://firebase.google.com/products/hosting) and
    [Firebase ML](https://firebase.google.com/products/ml).

Please [start a Discussion](https://github.com/roboflow/supashim/discussions)
to make a proposal if you'd like to work on any of these or see them added.
