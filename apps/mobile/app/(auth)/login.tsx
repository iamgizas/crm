import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, useColorScheme, ActivityIndicator, Alert,
} from 'react-native'
import { supabase } from '../../src/lib/supabase'
import { Colors } from '../../constants/Colors'

export default function LoginScreen() {
  const scheme = useColorScheme() ?? 'dark'
  const cores  = Colors[scheme]

  const [email, setEmail]       = useState('')
  const [senha, setSenha]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Preencha e-mail e senha')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    })

    setLoading(false)

    if (error) {
      Alert.alert('Erro ao entrar', 'E-mail ou senha incorretos.')
    }
    // Se deu certo, o onAuthStateChange no _layout.tsx redireciona automaticamente
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      {/* Logo / título */}
      <Text style={[styles.titulo, { color: cores.primary }]}>CRM</Text>
      <Text style={[styles.subtitulo, { color: cores.textMuted }]}>
        Faça login para continuar
      </Text>

      {/* Campo e-mail */}
      <TextInput
        style={[styles.input, {
          backgroundColor: cores.card,
          color:           cores.text,
          borderColor:     cores.border,
        }]}
        placeholder="E-mail"
        placeholderTextColor={cores.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />

      {/* Campo senha */}
      <TextInput
        style={[styles.input, {
          backgroundColor: cores.card,
          color:           cores.text,
          borderColor:     cores.border,
        }]}
        placeholder="Senha"
        placeholderTextColor={cores.textMuted}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete="password"
      />

      {/* Botão entrar */}
      <TouchableOpacity
        style={[styles.botao, { backgroundColor: cores.primary }]}
        onPress={entrar}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.botaoTexto}>Entrar</Text>
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  titulo: {
    fontSize:   48,
    fontWeight: '800',
    textAlign:  'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize:     14,
    textAlign:    'center',
    marginBottom: 40,
  },
  input: {
    height:        52,
    borderRadius:  12,
    borderWidth:   1,
    paddingHorizontal: 16,
    fontSize:      16,
    marginBottom:  16,
  },
  botao: {
    height:        52,
    borderRadius:  12,
    alignItems:    'center',
    justifyContent: 'center',
    marginTop:     8,
  },
  botaoTexto: {
    color:      '#fff',
    fontSize:   16,
    fontWeight: '700',
  },
})
