<template>
    <v-layout row class="text-xs-center pa-lg-16" justify-center align-center >
        <v-flex xs3>
            <v-img :src="require('@/assets/logo.png')" width="350px"></v-img>
        </v-flex>
        <v-flex xs3>
            <v-card class="pa-5">
                <v-form>
                    <v-layout row>
                        <v-flex xs11>
                            <v-text-field prepend-icon="mdi-account" v-model="email" name="Email" label="Email" type="text" color="#000000"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs11>
                            <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="text" color="#000000"></v-text-field>
                            <v-text-field prepend-icon="mdi-key" v-model="password" name="Password" label="Password" type="password" color="#000000"></v-text-field>
                        </v-flex>

                    </v-layout>
                    <v-card-actions>
                        <v-btn class="white--text" primary large block style="background-color: #afd29a;" @click="login">Login</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
          <center><v-text> Ainda não possuí conta? </v-text> <span class="font-weight-bold black--text" @click="registar()" style="cursor: pointer;" > Registe-se aqui! </span></center>        
        </v-flex>
    </v-layout>  
</template>