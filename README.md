[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)
[![sxl](https://github.com/wiremoons/sxl/actions/workflows/sxl-build-deno.yml/badge.svg?branch=main)](https://github.com/wiremoons/sxl/actions/workflows/sxl-build-deno.yml)

# sxl (SpaceX Launch)

Command line program called `sxl` to display the '*last*' and the '*next*'
scheduled SpaceX launches.

## Application Usage

Under development - but functioning correctly and usable.

Output of the program when run is:

```console
SpaceX - Rocket Launch Information

Latest SpaceX Launch 🚀

Flight Number     : 151
Flight Name       : Starlink 4-11 (v1.5)
Launchpad         : Vandenberg Space Force Base Space Launch Complex 4E California. Launched 21 of 21 attempts.
Launch Date       : Fri, 25 Feb 2022 17:12:00 GMT 
Flight Successful : true 

Payload Details:
Payload is: Starlink 4-11 (v1.5) (Satellite) for customer: SpaceX. Payload manufactured by: SpaceX.

Flight Details:
None available



Next Scheduled SpaceX Launch 🚀

Flight Number     : 152
Flight Name       : Starlink 4-9 (v1.5)
Launchpad         : Kennedy Space Center Historic Launch Complex 39A Florida. Launched 44 of 44 attempts.
Launch Date       : Thu, 03 Mar 2022 14:32:00 GMT [Precision: HOUR]
Flight Successful : Awaiting launch 

Payload Details:
Payload is: Starlink 4-9 (v1.5) (Satellite) for customer: SpaceX. Payload manufactured by: SpaceX.

Flight Details:
None available
```

## Development Information

The application in written using the _Deno_ runtime and the TypeScript
programming language, so can be used on any operating systems support by Deno,
such as Windows, Linux, macOS, etc. More information about Deno is available
here:

- [Deno's web site](https://deno.land/)
- [Deno on GitHub](https://github.com/denoland)

## Downloading

Download the program to your computer - the simplest method is to clone this
GitHub repo with `git` as below:

```console
git clone https://github.com/wiremoons/sxl.git
```

The program is the *TypeScript* file named: `sxl.ts`. See below for options on
how to run it.

## Running the program

The program can be run either as a Deno script or as a self contained compiled
program. See information below if needed on **Installing Deno**.

Once the GitHub repo is cloned to you computer, ensure you are in its directory
first.

On operating systems such as *Linux*, *macOS*, and *WSL* the program can be
executed as a script directly. Just ensure the `sxl.ts` is made executable (see
`chmod` command below), and then run it directly with: `./sxl.ts`

```console
chmod 755 sxl.ts
```

The program can be run with *Deno* using the command:

```console
deno run --quiet --allow-read --allow-net=api.spacexdata.com ./sxl.ts
```

The program can be compiled with *Deno* using the command:

```console
deno compile --quiet --allow-read --allow-net=api.spacexdata.com ./sxl.ts
```

### Installing Deno

First ensure you have installed a copy of the `deno` or `deno.exe` program, and
it is in your operating systems path. See the relevant
[Deno install instruction](https://github.com/denoland/deno_install) or just
download the
[Deno release version](https://github.com/denoland/deno/releases)
directly.

Install is easy as it is just a single binary executable file - just download a
copy and add it to a directory in your path.

## Acknowledgments

The application would not be possible without the use of the
[SpaceX REST API](https://github.com/r-spacex/SpaceX-API). Thank you for making
the API and the data it provides available for use!

## Licenses

The `sxl` application is provided under the *MIT open source license*. A copy of
the MIT license file is [here](./LICENSE).

The [SpaceX REST API](https://github.com/r-spacex/SpaceX-API) is provided under
the _Apache Licence Version 2.0_ open source licence. A copy of the licence file
is [here](https://github.com/r-spacex/SpaceX-API/blob/master/LICENSE).
