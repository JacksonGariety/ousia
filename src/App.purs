module Ousia.App where

import Prelude

import Halogen as H
import Halogen.HTML as HH

type State = { label :: String }

data Action = Toggle

component :: forall q i o m. H.Component HH.HTML q i o m
component =
  H.mkComponent
  { initialState
  , render
  , eval: H.mkEval $ H.defaultEval { handleAction = handleAction }
  }

initialState :: forall i. i -> State
initialState _ = { label: "bar" }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  let
    label = state.label
  in
   HH.div
     []
     [ HH.text label ]

handleAction :: forall o m. Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Toggle ->
    H.modify_ \st -> st { label = "foo" }
