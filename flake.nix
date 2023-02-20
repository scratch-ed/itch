{
  description = "Scratch Judge";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    devshell = {
      url = "github:numtide/devshell";
      inputs = {
        flake-utils.follows = "flake-utils";
        nixpkgs.follows = "nixpkgs";
      };
    };
  };

  outputs = { self, nixpkgs, devshell, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ devshell.overlay ];
          config.allowUnfree = true;
        };
      in
      {
        devShells = rec {
          default = itch;
          itch = pkgs.devshell.mkShell {
            name = "scratch-judge";
            packages = with pkgs; [
#               nodePackages.npm
              nodejs-16_x
              chromium
              git
            ];
            env = [
              {
                name = "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD";
                eval = "1";
              }
              {
                name = "PUPPETEER_EXECUTABLE_PATH";
                eval = "${pkgs.chromium.outPath}/bin/chromium";
              }
            ];
          };
        };
      }
    );
}
