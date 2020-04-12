module Ousia.Main where

import Prelude

import Effect.Unsafe (unsafePerformEffect)
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import Ousia.App as App

main :: Unit
main = unsafePerformEffect $ HA.runHalogenAff $ do
  -- Locate the <body /> element as soon as it's ready.
  body <- HA.awaitBody
  -- Render the application.
  runUI App.component unit body
