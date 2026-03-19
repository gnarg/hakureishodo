{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = { self, nixpkgs, systems, flake-utils }:
    flake-utils.lib.eachDefaultSystem
    (system:
      let
        pkgs = import nixpkgs { system = system; config.allowUnfree = true; };

        # Function to create script
        mkScript = name: text: let
        script = pkgs.writeShellScriptBin name text;
        in script;
   
        # Define your scripts/aliases
        scripts = [
          (mkScript "qwen" ''npx @qwen-code/qwen-code@latest'')
        ];
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            git
            jujutsu
            claude-code
            nodejs_24
            # opencode # curl -fsSL https://opencode.ai/install | bash
          ];
          
          # Environment variables for Python packages
          shellHook = ''
            export EDITOR=/usr/bin/vim
          '';
        };
      }
    );
}
