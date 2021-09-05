[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/hyperium/hyper/master/LICENSE)
[![sxl](https://github.com/wiremoons/sxl/actions/workflows/sxl-build-deno.yml/badge.svg?branch=main)](https://github.com/wiremoons/sxl/actions/workflows/sxl-build-deno.yml)

# sxl (SpaceX Launch)

Command line program called `sxl` to display the '_last_' and the '_next_'
scheduled SpaceX launches.

## Application Usage

Under development - but functioning correctly and usable.

Output of the program when run is:

```console
SpaceX  -  Rocket  Launch  Information
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯

Latest SpaceX Launch 🚀

Flight Number     : 133
Flight Name       : CRS-23
Planned Date      : Sun, 29 Aug 2021 07:14:00 GMT
Flight Successful : true

Flight Details:
SpaceX's 23rd ISS resupply mission on behalf of NASA, this mission brings essential supplies to the International Space Station using the cargo variant of SpaceX's Dragon 2 spacecraft. Cargo includes several science experiments. The booster for this mission is expected to land on an ASDS. The mission will be complete with return and recovery of the Dragon capsule and down cargo.

Payload Details:
Payload is: CRS-23 (Dragon 2.0) for customer: NASA (CRS). Payload manufactured by: SpaceX.


Next Scheduled SpaceX Launch 🚀

Flight Number     : 134
Flight Name       : Inspiration4
Planned Date      : Wed, 15 Sep 2021 00:00:00 GMT
Flight Successful : Not Applicable

Flight Details:
Inspiration4 is the world’s first all-civilian mission to space. The mission will be commanded by Jared Isaacman, the 37-year-old founder and Chief Executive Officer of Shift4 Payments and an accomplished pilot and adventurer. Inspiration4 will leave Earth from Kennedy Space Center’s historic Launch Complex 39A, the embarkation point for Apollo and Space Shuttle missions, and travel across a low earth orbit on a multi-day journey that will continually eclipse more than 90% of the earth’s population. Named in recognition of the four-person crew that will raise awareness and funds for St. Jude Children’s Research Hospital, this milestone represents a new era for human spaceflight and exploration.

Payload Details:
Payload is: Inspiration4 (Crew Dragon) for customer: Jared Isaacman. Payload manufactured by: SpaceX.
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

The program is the _TypeScript_ file named: `sxl.ts`. See below for options on
how to run it.

## Running the program

The program can be run either as a Deno script or as a self contained compiled
program. See information below if needed on **Installing Deno**.

Once the GitHub repo is cloned to you computer, ensure you are in its directory
first.

On operating systems such as _Linux_, _macOS_, and _WSL_ the program can be
executed as a script directly. Just ensure the `sxl.ts` is made executable (see
`chmod` command below), and then run it directly with: `./sxl.ts`

```console
chmod 755 sxl.ts
```

The program can be run with _Deno_ using the command:

```console
deno run --quiet --allow-net=api.spacexdata.com ./sxl.ts
```

The program can be compiled with _Deno_ using the command:

```console
deno compile --quiet --allow-net=api.spacexdata.com ./sxl.ts
```

### Installing Deno

First ensure you have installed a copy of the `deno` or `deno.exe` program, and
it is in your operating systems path. See the relevant
[Deno install instruction](https://github.com/denoland/deno_install) or just
download the
[Deno latest release version](https://github.com/denoland/deno/releases)
directly.

Install is easy as it is just a single binary executable file - just download a
copy and add it to a directory in your path.

## Acknowledgments

The application would not be possible without the use of the
[SpaceX REST API](https://github.com/r-spacex/SpaceX-API). Thank you for making
the API and the data it provides available for use!

## Licenses

The `sxl` application is provided under the _MIT open source license_. A copy of
the MIT license file is [here](./LICENSE).

The [SpaceX REST API](https://github.com/r-spacex/SpaceX-API) is provided under
the _Apache License Version 2.0_ open source license. A copy of the license file
is [here](https://github.com/r-spacex/SpaceX-API/blob/master/LICENSE).
