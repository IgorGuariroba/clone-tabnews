const calculadora = require('../models/calculadora')

test('somar 2 mais 2 tem que ser 4', () => {
    const resultado = calculadora.somar(2, 2)
    expect(resultado).toBe(4)
})

test('somar 5 mais 105 tem que ser 105', () => {
    const resultado = calculadora.somar(5, 100)
    expect(resultado).toBe(105)
})


test('somar 5 mais 105 tem que ser 105', () => {
    const resultado = calculadora.somar('banana', 100)
    expect(resultado).toBe("Erro")
})