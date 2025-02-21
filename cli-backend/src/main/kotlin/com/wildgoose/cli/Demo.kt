package com.wildgoose.cli

import com.github.ajalt.clikt.core.CliktCommand
import com.github.ajalt.clikt.core.main
import com.github.ajalt.clikt.core.subcommands
import com.github.ajalt.mordant.input.interactiveMultiSelectList
import com.github.ajalt.mordant.input.interactiveSelectList
import com.github.ajalt.mordant.terminal.Terminal
import com.github.ajalt.mordant.widgets.SelectList

enum class Shape {
    CIRCLE,
    SQUARE,
    TRIANGLE
}

enum class Color {
    RED,
    GREEN,
    BLUE
}

class MordantDemo : CliktCommand(name = "mordant") {

    override fun run() {
        val terminal = Terminal()

        val shape = terminal.interactiveSelectList(
            entries = Shape.entries.map { SelectList.Entry(it.name) },
            title = "Choose a shape"
        )
        terminal.println("Shape = $shape")

        val colors = terminal.interactiveMultiSelectList(
            entries = Color.entries.map { SelectList.Entry(it.name) },
            title = "Choose a color"
        )
        terminal.println("Colors = $colors")
    }
}

class KotterDemo : CliktCommand(name = "kotter") {

    override fun run() {
        // TODO: implement
    }
}

class DemoCommand : CliktCommand(name = "demo") {

    init {
        subcommands(MordantDemo(), KotterDemo())
    }

    override fun run() = Unit
}

fun main(args: Array<String>) = DemoCommand().main(args)
