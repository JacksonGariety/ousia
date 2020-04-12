{-
Welcome to a Spago project!
You can edit this file as you like.
-}
{ name = "ousia"
, dependencies = [ "console", "effect", "halogen", "psci-support" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
